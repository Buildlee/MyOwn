
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Item } from './types';

// Convert File to Base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve({
                inlineData: {
                    data: base64String,
                    mimeType: file.type,
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const recognizeImageWithGemini = async (file: File, apiKey: string): Promise<Partial<Item>> => {
    if (!apiKey) throw new Error("API Key is missing");

    const cleanKey = apiKey.trim();
    console.log('[Gemini] Initializing with Key:', cleanKey.substring(0, 4) + '****' + cleanKey.substring(cleanKey.length - 4));

    const genAI = new GoogleGenerativeAI(cleanKey);
    // User requested "Gemini 3 Flash" -> Mapping to "gemini-2.0-flash-exp" (Latest Next-Gen Flash)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const imagePart = await fileToGenerativePart(file);

    const prompt = `
    You are an expert OCR and E-commerce Data Extractor.
    Analyze the provided order screenshot.
    
    Task: Extract the following fields into a pure JSON object.

    1. "name": The product Name. 
       CRITICAL RULES for Name:
       - KEEP: Core Series (e.g. "iPhone 15 Pro", "Air Jordan 1", "Sony WH-1000XM5").
       - REMOVE: 
         - Quantities ("x1", "1件", "2个").
         - Marketing/Promo tags ("【热销】", "旗舰店", "正品").
         - Confusing specs ("256GB", "8+256", "黑色", "XL", "5G").
         - Redundant Brand prefixes if the model is unique (e.g. "Apple iPhone" -> "iPhone").
       - IGNORE:
         - Addresses/Locations (contains "省", "市", "区", "路", "号", "街道", "School", "Apartment").
         - Delivery Status ("已签收", "待取件", "派松中").
       
       *Tip: The Product Name is usually located centrally, below the Store Name (e.g. 'xx旗舰店'), or next to the product image thumbnail.*
       
       Few-Shot Examples:
       - "Apple iPhone 15 Pro Max 256GB 蓝色 5G全网通" -> "iPhone 15 Pro Max"
       - "Nike Air Force 1 '07 Low板鞋小白鞋" -> "Nike Air Force 1"
       - "Sony/索尼 WH-1000XM5 头戴式降噪耳机" -> "Sony WH-1000XM5"
       - "洁柔Face油画系列抽纸 3层100抽*24包" -> "洁柔抽纸"

    2. "price": The FINAL Payment Amount.
       - Look for keywords: "实付款", "实付", "合计", "Total".
       - IGNORE: "优惠", "立减", "原价".
       - If multiple prices exist, the Final Pay amount is usually the largest or the last one on the payment line.

    3. "purchaseDate": The Order Date (YYYY-MM-DD).

    Output JSON Format:
    {
        "name": "String",
        "price": Number,
        "purchaseDate": "YYYY-MM-DD"
    }
    
    Return ONLY JSON. No Markdown.
    `;

    try {
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Cleanup markdown code blocks if present (Gemini loves markdown)
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr);
    } catch (error: any) {
        // Handle Rate Limiting explicitly to avoid noisy console errors
        if (error.message?.includes('429')) {
            console.warn("Gemini Rate Limit Exceeded (429). Downgrading to local OCR.");
            throw new Error("QUOTA_EXCEEDED");
        }
        console.error("Gemini OCR Error:", error);
        throw error;
    }
};
