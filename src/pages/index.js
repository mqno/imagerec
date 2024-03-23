import Image from "next/image";
import { Inter } from "next/font/google";
import Camera from "@/components/Camera";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between py-24 ${inter.className}`}
    >
      <div className="flex flex-col gap-5 z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <Camera />
        <div>
          <h1 className="text-4xl font-bold text-center">Image Recognition</h1>
          <p className="text-lg text-center">
            This is a simple image recognition app that uses the Google Cloud
            Vertex AI API to recognize objects in images.
          </p>
          <p className="text-lg text-center">
            Click the "Start Camera" button to start the camera and the "Take
            Photo" button to take a photo.Search Image button to search the image and get the result.
            Switch camera button to switch the camera.
          </p>
          <br/>
          <p className="text-lg text-center">
            The photo will be uploaded to the server and the server will use the
            Google Cloud Vertex AI API to recognize the objects in the image.
          </p>
        </div>
     
      </div>
    </main>
  );
}
