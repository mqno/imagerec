// node --version # Should be >= 18
// npm install @google/generative-ai

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");


const MODEL_NAME = process.env.AI_MODEL;
const API_KEY = process.env.AI_STUDIO_API_KEY;

export default async function handler(req, res) {

  async function run() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const generationConfig = {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 4096,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
    const model = genAI.getGenerativeModel({ model: MODEL_NAME, generationConfig, safetySettings });

    const base64Image = req.body.image.split(';base64,').pop();

    const content = [
      "tell me the product is in that image in the following json format if you cant identify just say 'unable to identify'; {  product_name:\"\",  product_category:\"\",  product_model:\"\"}",
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      },
    ]
    const result = await model.generateContent(content);

    const response = result.response.text();
    return response;
  }
  
  try {
    const temp = await run();
    const data = JSON.parse(temp);
    
    if (temp === "unable to identify" || data.product_name === "unable to identify" || data.product_category === "unable to identify" || data.product_model === "unable to identify") {
      res.status(400).json({ message: 'unable to identify' });
    }
    res.status(200).json({data});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}