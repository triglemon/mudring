import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js'
import './CSS/Video.css';
import { detectFaceLandmarks } from 'face-api.js';

function Video() {
  const videoHeight = 768;
  const videoWidth = 1024;
  const [initializing, setInitializing] = useState(false)
  const videoRef = useRef();
  const canvasRef = useRef();
  const [output, setOutput] = useState({ expressions: "loading" });
  const [run, setRun] = useState();
  const [emotion , setEmotion] = useState(); 


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
      video: {}
    }, stream => videoRef.current.srcObject = stream,
      function () { console.warn("Error getting audio stream from getUserMedia") })
  }

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (initializing) {
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
      canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
      setRun(false);

      try {
        setOutput(detections[0].expressions);
        getEmotion(detections[0].expressions);
      } catch (err) {
        console.log(err);
      }

    }, 1000)
  }


  const getEmotion = async (expressions) => {
    var big = {
      name: "" ,
      value: null
    };

    for (var key in expressions) {
      if (expressions.hasOwnProperty(key)) {
        if (big.value < expressions[key]){
          big = {
            name : key ,
            value : expressions[key]
          }
        }
      }
    }
    console.log(`name : ${big.name} value: ${big.value}`);

    if (big.value > 0){
      
      setEmotion(big.name);
      console.log(emotion)
    }else {
      return "please wait"
    }


  }

  return (
    <div className="App">
      <span>{initializing ? 'Initializing' : 'Ready'}</span>
      <div className="display-flex justify-content-center">
        <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} />
        <canvas ref={canvasRef} className="position-absolute" />
      </div>
      <div >
        {initializing ? "loading" : JSON.stringify(emotion)}
      </div>

    </div>
  );
}

export default Video;