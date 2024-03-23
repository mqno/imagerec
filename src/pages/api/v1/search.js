import {PredictionServiceClient} from '@google-cloud/aiplatform';

export default async function handler(req, res) {
  const client = new PredictionServiceClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // replace with path to your service account key file
  });
  ;
// projects/original-list-418012/locations/europe-west1/publishers/google/models/gemini-1.0-pro-vision-001
  const request = {
    endpoint: `https://europe-west1-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/europe-west1/publishers/google/models/gemini-1.0-pro-vision:streamGenerateContent`, // replace with your endpoint
    instances: [
      {
        // Your data here
      },
    ],
  };

    // Send the request to the API
  // const [response] = await client.predict(request);

  res.status(200).json({message: 'Success'});
}