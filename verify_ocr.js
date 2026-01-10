const { createWorker } = require('tesseract.js');
const fs = require('fs');
const path = require('path');

// Mock Parse Logic (Copied from src/lib/ocr.ts and adapted for JS)
const extractPrice = (str) => {
    const match = str.match(/[¥￥yY元]\s*([0-9.]+)/);
    return match ? parseFloat(match[1]) : null;
};

const extractDate = (str) => {
    const match = str.match(/(\d{4})[-年.](\d{1,2})[-月.](\d{1,2})/);
    if (!match) return null;
    const [_, y, m, d] = match;
    const pad = (n) => n.length === 1 ? '0' + n : n;
    return `${y}-${pad(m)}-${pad(d)}`;
};

const parseItemDetails = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const result = {};

    // 1. DATE
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
    if (!result.purchaseDate) {
        for (const line of lines) {
            const date = extractDate(line);
            if (date) result.purchaseDate = date; // simplified fallback
        }
    }

    // 2. PRICE Extraction (Context-Aware Regex + Last Price Strategy)
    // Priority: 实付款 > 实付 > 成交价 > 应付款 > 合计 > 商品总价
    const priceKeywords = ['实付款', '实付', '成交价', '应付款', '合计', '商品总价'];
    for (const kw of priceKeywords) {
        // Find line containing keyword
        const line = lines.find(l => l.includes(kw));
        if (line) {
            console.log(`[DEBUG] Found Keyword "${kw}" in line: "${line}"`);

            // Strategy: Extract ALL prices from this line and take the LAST one.
            // This handles "实付款 共减 ¥19.9 合计 ¥179.1" -> 19.9, 179.1 -> Take 179.1
            const allPrices = [];
            // Regex to find all currency-like patterns including y/Y/元 and bare numbers if prefixed
            // Actually, simplified regex: find [CurrencyChars] + [Space] + [Number]
            // We use 'g' flag
            const priceRegex = /[¥￥yY元]\s*([0-9.]+)/g;
            const matches = line.matchAll(priceRegex);

            for (const m of matches) {
                allPrices.push(parseFloat(m[1]));
            }

            if (allPrices.length > 0) {
                console.log(`[DEBUG] All prices on line: ${allPrices.join(', ')}`);
                // Take the last one
                result.price = allPrices[allPrices.length - 1];
                console.log(`[DEBUG] Selected Price (Last): ${result.price}`);
                break;
            }
        }
    }

    // Fallback: Look for the largest number prefixed with ¥/￥
    if (!result.price) {
        let maxPrice = 0;
        for (const line of lines) {
            const matches = line.matchAll(/[¥￥yY元]\s*([0-9.]+)/g);
            for (const m of matches) {
                const p = parseFloat(m[1]);
                if (p > maxPrice && p < 10000000) maxPrice = p;
            }
        }
        if (maxPrice > 0) result.price = maxPrice;
    }

    // 3. NAME
    const noiseKeywords = [
        '中国移动', '中国联通', 'Wifi', '4G', '5G', 'AM', 'PM',
        '订单', '交易', '详情', '帮助', '返回', '首页', '搜索', '我的',
        '复制', '评价', '再次购买', '再买一单', '查看', '物流', '退款', '售后',
        '发货', '收货', '地址', '配送', '快递', '准时送达', '已签收', '送达',
        '微信支付', '支付宝', '优惠', '折扣',
        '下单时间', '付款时间',
        '实付款', '合计', '总价',
        '联系商家', '分享商品', '申请退款',
        '互图', '巴图', '描述', '服务', '质量'
    ];
    const isNoise = (l) => {
        if (l.length < 5) return true;
        if (/^\d+$/.test(l)) return true;
        if (/^[\d\-: ]+$/.test(l)) return true;
        if (/^\d{2}:\d{2}/.test(l)) return true;
        if (noiseKeywords.some(kw => l.includes(kw))) return true;
        return false;
    };
    let storeNameIndex = -1;
    for (let i = 0; i < Math.min(lines.length, 12); i++) {
        const l = lines[i];
        if (l.includes('旗舰店') || l.includes('专营店') || l.includes('超市') || (l.length > 2 && l.includes('>'))) {
            storeNameIndex = i;
            break;
        }
    }
    let candidateName = '';
    const startIdx = storeNameIndex !== -1 ? storeNameIndex + 1 : 0;
    for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('实付') || line.includes('合计') || line.includes('下单')) break;
        if (!isNoise(line)) {
            if (line.startsWith('【') || line.includes('】')) {
                candidateName = line;
                break;
            }
            if (storeNameIndex !== -1) {
                candidateName = line;
                break;
            }
            if (!candidateName && line.length > 6) {
                candidateName = line;
                break;
            }
        }
    }
    if (candidateName) {
        candidateName = candidateName.replace(/^[0-9]+件/, '').trim();
        result.name = candidateName;
    }

    return result;
};


(async () => {
    const images = [
        'C:/Users/CHLee/.gemini/antigravity/brain/5a3d9095-a457-4b51-ae55-04da0a64b3a7/uploaded_image_0_1768048264290.jpg',
        'C:/Users/CHLee/.gemini/antigravity/brain/5a3d9095-a457-4b51-ae55-04da0a64b3a7/uploaded_image_1_1768048264290.jpg',
        'C:/Users/CHLee/.gemini/antigravity/brain/5a3d9095-a457-4b51-ae55-04da0a64b3a7/uploaded_image_2_1768048264290.jpg',
        'C:/Users/CHLee/.gemini/antigravity/brain/5a3d9095-a457-4b51-ae55-04da0a64b3a7/uploaded_image_3_1768048264290.jpg',
        'C:/Users/CHLee/.gemini/antigravity/brain/5a3d9095-a457-4b51-ae55-04da0a64b3a7/uploaded_image_4_1768048264290.jpg'
    ];

    console.log('Initializing Tesseract with BEST quality models...');
    const worker = await createWorker(['chi_sim', 'eng'], 1, {
        langPath: 'https://tessdata.projectnaptha.com/4.0.0_best',
        gzip: false
    });
    console.log('Worker ready.');

    // Helper to clean up Chinese OCR artifacts
    const cleanupOCRText = (text) => {
        return text
            // Remove spaces between Chinese characters
            .replace(/(?<=[\u4e00-\u9fa5])\s+(?=[\u4e00-\u9fa5])/g, '')
            // Fix currency symbols
            .replace(/\b[yY]\s*(\d)/g, '¥$1')
            .replace(/元\s*(\d)/g, '¥$1');
    };

    for (const imgPath of images) {
        if (!fs.existsSync(imgPath)) {
            console.log(`File not found: ${imgPath}`);
            continue;
        }
        console.log(`\n--- Processing ${path.basename(imgPath)} ---`);
        try {
            const { data: { text } } = await worker.recognize(imgPath);
            const cleanText = cleanupOCRText(text);
            const result = parseItemDetails(cleanText);
            console.log('Parsed Result:', JSON.stringify(result, null, 2));
        } catch (err) {
            console.error('Error:', err);
        }
    }

    await worker.terminate();
})();
