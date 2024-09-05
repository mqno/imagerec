import React, { useRef, useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import SelectComponent from './SelectComponent';
function Camera() {
  const videoRef = useRef(null);
  const [takenPhoto, setTakenPhoto] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(null);
  const [camLabel, setCamLabel] = useState('');
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  let currentDeviceId = '';

  let currentStream = null;

  useEffect(() => {
    if (videoRef.current.srcObject && !isCameraActive) {

      setIsCameraActive(true);
    }
  } 
  , [videoRef?.current?.srcObject]);


useEffect(() => {
  const setAllDevices = () => {
    navigator.mediaDevices.enumerateDevices()
      .then(function(devices) {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices[0]) {
          currentDeviceId = videoDevices[0].deviceId;
        }
      })
      .catch(function(err) {
        console.error(err);
      });
  }
  if(navigater){
    setAllDevices();
  } else {
    setTimeout(() => setAllDevices(), 8000);
  }
}, []);
  

const startCamera = (deviceId = devices[0]?.deviceId) => {
  // Stop the current stream if it exists
  setCamLabel(devices.find(device => device.deviceId === deviceId).label);
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
  navigator.mediaDevices.getUserMedia({ 
    video: { deviceId: { exact: deviceId } } 
  })
    .then(function(stream) {
      if (videoRef.current) {
        setIsCameraActive(true);
        videoRef.current.srcObject = stream;
        currentStream = stream; // Store the current stream
      }
    })
    .catch(function(err) {
      console.error(err);
    });
};
/*
const switchCamera = () => {
  const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
  const nextIndex = (currentIndex + 1) % devices.length;
  currentDeviceId = devices[nextIndex].deviceId;
  startCamera(currentDeviceId);
};
*/
const takePhoto = () => {
  const canvas = document.createElement('canvas');
  const video = videoRef.current;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Convert canvas to base64
  const base64Image = canvas.toDataURL('image/jpeg');
  setTakenPhoto(base64Image);
};
  
  const searchImage = async () => { 
    setLoading(true);
    const image = takenPhoto;
    try {
      const response = await fetch('/api/v1/find-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: image }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        setResult(null);
        throw new Error(data.message);
      }
      if (response.status === 200) {
        setResult(data);
        setLoading(false);
        setError(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('unable to identify');
      setLoading(false);
    }
  }
  

  return (
    <div className='flex flex-col gap-4 justify-center items-center'>
      <h1 className="text-4xl font-bold text-center">{camLabel}</h1>
      <video className="artboard artboard-horizontal phone-1 bg-base-300" ref={videoRef} autoPlay />
      
      <div className='flex gap-2 justify-center items-center flex-wrap'>
        <button className='btn btn-primary' onClick={()=>startCamera(devices.filter(device => device.kind === 'videoinput')?.[0]?.deviceId)}>Start Camera</button>  
        <button className='btn btn-secondary' onClick={takePhoto} disabled={!isCameraActive || loading}>
          {loading ? <span className='flex justify-center items-center gap-2'><LoadingSpinner size="sm" />  <p>Processing</p>  </span>: 'Take Photo'}
        </button>
        <button className='btn btn-accent' onClick={searchImage} disabled={(!isCameraActive || !takenPhoto) || loading}>
             {loading ? <span className='flex justify-center items-center gap-2'><LoadingSpinner size="sm" />  <p>Processing</p>  </span>: 'Search Image'}
        </button>
        {/*<button className='btn btn-warning' onClick={switchCamera} disabled={!isCameraActive || loading}>
          ⟳ switch camera
        </button>
        */}
      </div>
      <SelectComponent devices={devices} startCamera={startCamera} />
      {result && <div>
        <h1 className="text-4xl font-bold text-center">Result</h1>
        <p className="text-lg text-center">name : {result?.data?.product_name}</p>
        <p className="text-lg text-center">category : {result?.data?.product_category}</p>
        <p className="text-lg text-center">model : {result?.data?.product_model}</p>
      </div>}
      {error && <div>
        <h1 className="text-4xl font-bold text-center text-error">Error</h1>
        <p className="text-lg text-center">{error}</p>
      </div>}
      {takenPhoto && <div className='my-4 '>
        <img src={takenPhoto} alt="Taken" />
      </div>}
    </div>
  );
}

export default Camera;