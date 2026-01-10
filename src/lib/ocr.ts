import { createWorker } from 'tesseract.js';
import { Item } from './types';

export const recognizeImage = async (file: File): Promise<string> => {
    // 1. Preprocess Image (Dark Mode -> Light Mode, Grayscale, Contrast)
    const processedImage = await preprocessImage(file);

    // 2. OCR (Enable both Chinese and English to prevent alphanumeric garbling)
    // Use the "best" traineddata (larger files, higher accuracy)
    const worker = await createWorker(['chi_sim', 'eng'], 1, {
        langPath: 'https://tessdata.projectnaptha.com/4.0.0_best',
        gzip: false
    });
    const ret = await worker.recognize(processedImage);
    await worker.terminate();

    // 3. Post-process (Cleanup Chinese spaces and artifacts)
    return cleanupOCRText(ret.data.text);
};

// Helper to clean up Chinese OCR artifacts
const cleanupOCRText = (text: string): string => {
    return text
        // Remove spaces between Chinese characters (lookbehind/lookahead for Chinese range)
        .replace(/(?<=[\u4e00-\u9fa5])\s+(?=[\u4e00-\u9fa5])/g, '')
        // Fix common OCR currency errors
        .replace(/\b[yY]\s*(\d)/g, '¥$1')
        .replace(/元\s*(\d)/g, '¥$1');
};

// Image Preprocessing Pipeline
const preprocessImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(URL.createObjectURL(file)); // Fallback
                return;
            }

            // Resize if too huge (optional, but good for speed)
            // Tesseract ideal height is ~30px per character line. 
            // Smartphones are high res, usually fine. 
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            // 1. Analyze Brightness to detect Dark Mode
            let totalBrightness = 0;
            for (let i = 0; i < data.length; i += 4) {
                totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
            }
            const avgBrightness = totalBrightness / (data.length / 4);
            const isDarkMode = avgBrightness < 128;

            // 2. Apply Filters
            for (let i = 0; i < data.length; i += 4) {
                let r = data[i];
                let g = data[i + 1];
                let b = data[i + 2];

                // Invert if Dark Mode
                if (isDarkMode) {
                    r = 255 - r;
                    g = 255 - g;
                    b = 255 - b;
                }

                // Grayscale (Luminance)
                let gray = 0.299 * r + 0.587 * g + 0.114 * b;

                // Contrast Stretching (Simple)
                // factor > 1 increases contrast
                const contrastFactor = 1.2;
                gray = ((gray - 128) * contrastFactor) + 128;

                // Clamp
                gray = Math.max(0, Math.min(255, gray));

                // Binarization (Optional: Tesseract does this internally, but helping it helps)
                // Let's stick to High Contrast Grayscale for now, it retains details better than naive thresholding

                data[i] = gray;
                data[i + 1] = gray;
                data[i + 2] = gray;
            }

            ctx.putImageData(imgData, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
};

// Helper to clean price strings
const extractPrice = (str: string): number | null => {
    // Expand regex to catch 'y' or 'Y' which Tesseract often sees for ¥ in some fonts
    const match = str.match(/[¥￥yY元]\s*([0-9.]+)/);
    return match ? parseFloat(match[1]) : null;
};

// Helper to extract date
const extractDate = (str: string): string | null => {
    // Match YYYY-MM-DD or YYYY年MM月DD日 or YYYY.MM.DD
    const match = str.match(/(\d{4})[-年.](\d{1,2})[-月.](\d{1,2})/);
    if (!match) return null;
    const [_, y, m, d] = match;
    const pad = (n: string) => n.length === 1 ? '0' + n : n;
    return `${y}-${pad(m)}-${pad(d)}`;
};

export const parseItemDetails = (text: string): Partial<Item> => {
    // 1. Text Cleanup
    // Squeeze multiple newlines, trim lines
    const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);

    const result: Partial<Item> = {};

    // --- STRATEGY: Key-Value Extraction based on Anchors ---

    // 1. DATE Extraction
    // Priority: 下单时间 > 付款时间 > 创建时间 > 交易时间 > Any Date
    const dateKeywords = ['下单时间', '付款时间', '创建时间', '交易时间'];
    for (const kw of dateKeywords) {
        const line = lines.find(l => l.includes(kw));
        if (line) {
            const date = extractDate(line);
            if (date) {
                result.purchaseDate = date;
                break;
            }
        }
    }
    // Fallback: First valid date found if no keyword matched
    if (!result.purchaseDate) {
        for (const line of lines) {
            const date = extractDate(line);
            if (date) {
                result.purchaseDate = date;
                break;
            }
        }
    }

    // 2. PRICE Extraction
    // Priority: 实付款 > 实付 > 成交价 > 应付款 > 合计 > 商品总价
    const priceKeywords = ['实付款', '实付', '成交价', '应付款', '合计', '商品总价'];
    for (const kw of priceKeywords) {
        // Find line containing keyword
        const line = lines.find(l => l.includes(kw));
        if (line) {
            let priceVal: number | null = null;

            // Strategy A: If line contains explicit "Total" (合计) and not currently scanning "Total" keyword
            // (Though scanning "Total" uses Strategy B naturally)
            // JD Pattern: "实付款 共减 ¥19.9 合计 ¥179.1"
            if (line.includes('合计')) {
                const totalRegex = /合计[^0-9\n¥￥yY元]*([¥￥yY元]?\s*(\d+(\.\d+)?))/;
                const match = line.match(totalRegex);
                if (match) {
                    priceVal = parseFloat(match[2]);
                }
            }

            // Strategy B: If no "Total" or extraction failed, get the LAST price on the line.
            // Standard E-commerce Convention: Final Price is at the end of the line.
            // (e.g. "实付款 ¥90.00" -> 90.00)
            // (e.g. "实付款 ¥90.00 (优惠 ¥10)" -> 10 ?? Risk, but usually text is "优惠 ¥10 实付 ¥90")
            // IF the text is "实付款 ¥90 (优惠 ¥10)", then Last is 10.
            // However, our analysis of user screenshots shows "Label ... Discount ... FinalPrice".
            if (priceVal === null) {
                const allPrices: number[] = [];
                const priceRegex = /[¥￥yY元]\s*([0-9.]+)/g;
                const matches = line.matchAll(priceRegex);
                for (const m of matches) {
                    allPrices.push(parseFloat(m[1]));
                }
                if (allPrices.length > 0) {
                    priceVal = allPrices[allPrices.length - 1];
                }
            }

            if (priceVal !== null) {
                result.price = priceVal;
                break;
            }
        }
    }

    // Fallback: Look for the largest number prefixed with ¥/￥
    if (!result.price) {
        let maxPrice = 0;
        for (const line of lines) {
            const matches = line.matchAll(/[¥￥]\s*([0-9.]+)/g);
            for (const m of matches) {
                const p = parseFloat(m[1]);
                // Filter out year-like numbers (e.g. 2025) if they appear as price by mistake, 
                // though usually years don't have ¥ prefix. 
                if (p > maxPrice && p < 10000000) maxPrice = p;
            }
        }
        if (maxPrice > 0) result.price = maxPrice;
    }

    // 3. NAME Extraction
    // Heuristics:
    // - Often after a "Store Name" (contains > or 旗舰店/专营店)
    // - Often contains specific punctuation 【】 in PDD
    // - Exclude lines that are clearly status/headers

    // Step A: Define Filters
    const noiseKeywords = [
        '中国移动', '中国联通', 'Wifi', '4G', '5G', 'AM', 'PM', // Status Bar
        '订单', '交易', '详情', '帮助', '返回', '首页', '搜索', '我的', // Nav
        '复制', '评价', '再次购买', '再买一单', '查看', '物流', '退款', '售后', // Actions
        '发货', '收货', '地址', '配送', '快递', '准时送达', '已签收', '送达', // Logistics
        '微信支付', '支付宝', '优惠', '折扣', // Payment info
        '下单时间', '付款时间', // Date lines
        '实付款', '合计', '总价', // Price lines
        '联系商家', '分享商品', '申请退款', // Buttons
        '互图', '巴图', '描述', '服务', '质量' // Screenshot noise
    ];

    const isNoise = (l: string) => {
        if (l.length < 5) return true; // Too short
        if (/^\d+$/.test(l)) return true; // Pure numbers
        if (/^[\d\-: ]+$/.test(l)) return true; // Date/Time only
        if (/^\d{2}:\d{2}/.test(l)) return true; // Starts with time (e.g. 20:28 ... noise)
        if (noiseKeywords.some(kw => l.includes(kw))) return true;
        return false;
    };

    // Step B: Find Anchor (Store Name)
    let storeNameIndex = -1;
    for (let i = 0; i < Math.min(lines.length, 12); i++) { // Check top lines
        const l = lines[i];
        if (l.includes('旗舰店') || l.includes('专营店') || l.includes('超市') || (l.length > 2 && l.includes('>'))) {
            storeNameIndex = i;
            break;
        }
    }

    // Step C: Search for Name
    let candidateName = '';

    // If store found, look immediately after it
    const startIdx = storeNameIndex !== -1 ? storeNameIndex + 1 : 0;

    for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i];

        // Stop if we hit price/date section (usually lower down)
        if (line.includes('实付') || line.includes('合计') || line.includes('下单')) break;

        if (!isNoise(line)) {
            // Strong signal: Pinduoduo style 【Title】
            if (line.startsWith('【') || line.includes('】')) {
                candidateName = line;
                break;
            }

            // If we found a store, the very next non-noise line is likely the product
            if (storeNameIndex !== -1) {
                candidateName = line;
                break;
            }

            // Fallback: First reasonable length line if no store found
            if (!candidateName && line.length > 6) {
                candidateName = line;
                break;
            }
        }
    }

    // New: Remove common prefixes/suffixes/tags from name
    if (candidateName) {
        candidateName = candidateName
            .replace(/^[0-9]+件/, '') // Remove "1件"
            .trim();
        result.name = candidateName;
    }

    return result;
};
