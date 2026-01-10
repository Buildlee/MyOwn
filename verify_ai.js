const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// --- CONFIGURATION ---
// PLEASE ENTER YOUR API KEY HERE BEFORE RUNNING
const API_KEY = process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE";
// ---------------------

if (API_KEY === "YOUR_API_KEY_HERE") {
    console.error("❌ Please edit this file and set your API_KEY, or run: set GEMINI_API_KEY=your_key && node verify_ai.js");
    process.exit(1);
}

// Clean Key
const cleanKey = API_KEY.trim();
const genAI = new GoogleGenerativeAI(cleanKey);
// Using the same model as in production for consistent results
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// Updated Prompt Logic (Sync with src/lib/gemini.ts)
const PROMPT = `
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

// Helper to convert file to base64
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

(async () => {
    // Artifact Images from the session
    const imagePaths = [
        'C:/Users/CHLee/.gemini/antigravity/brain/5a3d9095-a457-4b51-ae55-04da0a64b3a7/uploaded_image_0_1768048264290.jpg',
        'C:/Users/CHLee/.gemini/antigravity/brain/5a3d9095-a457-4b51-ae55-04da0a64b3a7/uploaded_image_1_1768048264290.jpg',
        'C:/Users/CHLee/.gemini/antigravity/brain/5a3d9095-a457-4b51-ae55-04da0a64b3a7/uploaded_image_2_1768048264290.jpg',
        'C:/Users/CHLee/.gemini/antigravity/brain/5a3d9095-a457-4b51-ae55-04da0a64b3a7/uploaded_image_3_1768048264290.jpg',
        'C:/Users/CHLee/.gemini/antigravity/brain/5a3d9095-a457-4b51-ae55-04da0a64b3a7/uploaded_image_4_1768048264290.jpg',
        'C:/Users/CHLee/.gemini/antigravity/brain/5a3d9095-a457-4b51-ae55-04da0a64b3a7/uploaded_image_1768064273412.jpg'
    ];

    console.log(`🤖 Starting AI Verification with Model: gemini-2.0-flash-exp`);
    console.log(`🔑 Key Status: Present (Prefix: ${cleanKey.substring(0, 4)}...)`);
    console.log('-'.repeat(50));

    for (const imgPath of imagePaths) {
        if (!fs.existsSync(imgPath)) {
            console.warn(`⚠️ File not found (skipping): ${imgPath}`);
            continue;
        }

        console.log(`\n📸 Processing: ${path.basename(imgPath)}`);
        try {
            const imagePart = fileToGenerativePart(imgPath, "image/jpeg"); // Assuming JPEG for simplicity
            const result = await model.generateContent([PROMPT, imagePart]);
            const response = await result.response;
            const text = response.text();

            // Clean markdown
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(jsonStr);

            console.log(`✅ Extracted:`);
            console.log(`   Name:  "${data.name}"`);
            console.log(`   Price: ¥${data.price}`);
            console.log(`   Date:  ${data.purchaseDate}`);

        } catch (error) {
            console.error(`❌ Error processing ${path.basename(imgPath)}:`);
            console.error(error.message);
        }
    }
    console.log('\n✨ Verification Complete.');
})();
