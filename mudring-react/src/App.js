import React, {useState, useEffect, useRef} from 'react';
import * as faceapi from 'face-api.js'
import './App.css';

function App() {
  const videoHeight = 480;
  const videoWidth = 640;
  const [initializing, setInitializing] = useState(false)
  const videoRef = useRef();
  const audioRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models'
      setInitializing(true);
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(startVideo)
    }
    loadModels();
  }, [])

  const startVideo = () => {
    navigator.getUserMedia({
      audio: true, video : true
    }, stream => {
      videoRef.current.srcObject = new MediaStream(stream.getVideoTracks());
      audioRef.current.srcObject = new MediaStream(stream.getAudioTracks());
    },
    function (){console.warn("Error getting audio stream from getUserMedia")})
  }

  const handleVideoOnPlay = () => {
    setInterval(async() => {
      if(initializing){
        setInitializing(false);
      }
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
      const displaySize = {
        width: videoWidth,
        height: videoHeight
      }
      faceapi.matchDimensions(canvasRef.current, displaySize);
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvasRef.current.getContext('2d').clearRect(0,0, videoWidth, videoHeight);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
      console.log(detections)
    }, 100)
  }

  return (
    <div className="App">
      <span>{initializing ? 'Initializing' : 'Ready'}</span>
      <div>
        <audio ref={audioRef} autoPlay></audio>
        <video ref={videoRef} autoPlay height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay}/>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default App;