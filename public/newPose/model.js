// const videoElement = document.getElementsByClassName('input_video')[0];
// const canvasElement = document.getElementsByClassName('output_canvas')[0];
// const canvasCtx = canvasElement.getContext('2d');
// // const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
// // const grid = new LandmarkGrid(landmarkContainer);

// function onResults(results) {
//     if (!results.poseLandmarks) {
//         grid.updateLandmarks([]);
//         return;
//     }

//     canvasCtx.save();
//     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//     canvasCtx.drawImage(results.segmentationMask, 0, 0,
//         canvasElement.width, canvasElement.height);

//     // Only overwrite existing pixels.
//     canvasCtx.globalCompositeOperation = 'source-in';
//     // canvasCtx.fillStyle = '#00FF00';
//     canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

//     // Only overwrite missing pixels.
//     canvasCtx.globalCompositeOperation = 'destination-atop';
//     canvasCtx.drawImage(
//         results.image, 0, 0, canvasElement.width, canvasElement.height);

//     canvasCtx.globalCompositeOperation = 'source-over';
//     // drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
//     //     { color: '#00FF00', lineWidth: 4 });
//     drawLandmarks(canvasCtx, results.poseLandmarks,
//         { color: '#FF0000', lineWidth: 2 });
//     canvasCtx.restore();

//     // grid.updateLandmarks(results.poseWorldLandmarks);
// }

// const pose = new Pose({
//     locateFile: (file) => {
//         return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
//     }
// });
// pose.setOptions({
//     modelComplexity: 1,
//     smoothLandmarks: true,
//     enableSegmentation: true,
//     smoothSegmentation: true,
//     minDetectionConfidence: 0.5,
//     minTrackingConfidence: 0.5
// });
// pose.onResults(onResults);

// const camera = new Camera(videoElement, {
//     onFrame: async () => {
//         await pose.send({ image: videoElement });
//     },
//     width: 1280,
//     height: 720
// });
// camera.start();


// const videoElement = document.getElementsByClassName('webcam')[0];
// const canvasElement = document.getElementsByClassName('output_canvas')[0];
// const canvasCtx = canvasElement.getContext('2d');

// function onResults(results) {
//     canvasCtx.save();
//     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//     canvasCtx.drawImage(results.segmentationMask, 0, 0,
//         canvasElement.width, canvasElement.height);

//     // Only overwrite existing pixels.
//     canvasCtx.globalCompositeOperation = 'source-in';
//     canvasCtx.fillStyle = '#00FF00';
//     canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

//     // Only overwrite missing pixels.
//     canvasCtx.globalCompositeOperation = 'destination-atop';
//     canvasCtx.drawImage(
//         results.image, 0, 0, canvasElement.width, canvasElement.height);

//     canvasCtx.globalCompositeOperation = 'source-over';
//     drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
//         { color: '#00FF00', lineWidth: 4 });
//     drawLandmarks(canvasCtx, results.poseLandmarks,
//         { color: '#FF0000', lineWidth: 2 });
//     drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
//         { color: '#C0C0C070', lineWidth: 1 });
//     drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
//         { color: '#CC0000', lineWidth: 5 });
//     drawLandmarks(canvasCtx, results.leftHandLandmarks,
//         { color: '#00FF00', lineWidth: 2 });
//     drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
//         { color: '#00CC00', lineWidth: 5 });
//     drawLandmarks(canvasCtx, results.rightHandLandmarks,
//         { color: '#FF0000', lineWidth: 2 });
//     canvasCtx.restore();
// }

// const holistic = new Holistic({
//     locateFile: (file) => {
//         return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
//     }
// });
// holistic.setOptions({
//     modelComplexity: 1,
//     smoothLandmarks: true,
//     enableSegmentation: true,
//     smoothSegmentation: true,
//     refineFaceLandmarks: true,
//     minDetectionConfidence: 0.5,
//     minTrackingConfidence: 0.5
// });
// holistic.onResults(onResults);

// const camera = new Camera(videoElement, {
//     onFrame: async () => {
//         await holistic.send({ image: videoElement });
//     },
//     width: 1280,
//     height: 720
// });
// camera.start();

import { PoseLandmarker, FilesetResolver, DrawingUtils } from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";

let poseLandmarker = undefined;
let runningMode = "VIDEO";
let enableWebcamButton;
let webcamRunning = false;
const videoHeight = "0px";
const videoWidth = "0px";

try {
    // alert("---start---");
    const video = document.getElementById("webcam");
    const canvasElement = document.getElementById("output_canvas");
    const canvasCtx = canvasElement.getContext("2d");
    const drawingUtils = new DrawingUtils(canvasCtx);
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
    const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
            delegate: "GPU",
        },
        // outputSegmentationMasks: true,
        runningMode,
    });
    // alert("---model_loaded---");
    // window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ name: "John", age: 30, city: "New York" }));


    // Check if webcam access is supported.
    const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

    // If webcam supported, add event listener to button for when user
    // wants to activate it.
    if (!hasGetUserMedia()) {

        // console.warn("getUserMedia() is not supported by your browser");
        alert("getUserMedia() is not supported by your browser");
    }


    const constraints = {
        audio: false,
        video: {
            facingMode: "environment",
        },
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });

    let lastVideoTime = -1;
    async function predictWebcam() {
        // canvasElement.style.height = videoHeight;
        // video.style.height = videoHeight;
        // canvasElement.style.width = videoWidth;
        // video.style.width = videoWidth;
        // Now let's start detecting the stream.
        // if (runningMode === "IMAGE") {
        //     runningMode = "VIDEO";
        //     await poseLandmarker.setOptions({ runningMode: "VIDEO" });
        // }
        let startTimeMs = performance.now();
        if (lastVideoTime !== video.currentTime) {
            lastVideoTime = video.currentTime;
            poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
                canvasCtx.save();
                canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                // window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(result));
                for (const landmark of result.landmarks) {
                    drawingUtils.drawLandmarks(landmark, {
                        radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
                    });
                    drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
                }
                canvasCtx.restore();

                // canvasCtx.globalCompositeOperation = 'source-in';
                // canvasCtx.fillStyle = '#00FF00';
                // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

                // // Only overwrite missing pixels.
                // canvasCtx.globalCompositeOperation = 'destination-atop';
                // canvasCtx.drawImage(
                //     result.image, 0, 0, canvasElement.width, canvasElement.height);

                // canvasCtx.globalCompositeOperation = 'source-over';
                // drawingUtils.drawConnectors(result.poseLandmarks, POSE_CONNECTIONS,
                //     { color: '#00FF00', lineWidth: 4 });
                // drawingUtils.drawLandmarks(result.poseLandmarks,
                //     { color: '#FF0000', lineWidth: 2 });
                // canvasCtx.restore();
            });
        }

        // Call this function again to keep predicting when the browser is ready.
        if (hasGetUserMedia()) {
            window.requestAnimationFrame(predictWebcam);
        }
    }
} catch (error) {
    alert(error);
}
