const prompt = `i need you to tell me the product is in that image in the following json format 
{
	product_name:"",
	product_category:"",
	product_model:""
}
`;

const {VertexAI} = require('@google-cloud/vertexai');

/**
 * TODO(developer): Update these variables before running the sample.
 */
export default async function handler(req, res) {
  const {image} = req.body;

  const settings = {
    projectId : process.env.GOOGLE_PROJECT_ID,
    location : 'europe-west1',
    model : 'gemini-1.0-pro-vision',
  };

  async function createNonStreamingMultipartContent(settings) {
    const {projectId,location,model} = settings;
    // Initialize Vertex with your Cloud project and location
    const vertexAI = new VertexAI({ project: projectId, location: location });
    // Instantiate the model
    const generativeVisionModel = vertexAI.getGenerativeModel({
      model: model,
    });
    // For images, the SDK supports both Google Cloud Storage URI and base64 strings
    const filePart = {inline_data: {data: image, mime_type: 'image/jpeg'}};
    const textPart = {text: prompt };
    const request = {
      contents: [{ role: 'user', parts: [filePart, textPart] }],
    };
    // Create the response stream
    const responseStream =
      await generativeVisionModel.generateContentStream(request);
    // Wait for the response stream to complete
    const aggregatedResponse = await responseStream.response;
    // Select the text from the response
    const fullTextResponse = aggregatedResponse.candidates[0].content.parts[0].text;
    console.log(fullTextResponse);
    return (fullTextResponse);
  }
  try {
    const result = await createNonStreamingMultipartContent(settings);
    res.status(200).json(result);
  }catch (error) {
    res.status(500).json({message: error.message});
  }

}