import React from "react";
import Script from "next/script";
import { Head } from "next/document";

function Pose() {
  return (
    <div>
      <Head>
        <script src="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js" crossorigin="anonymous"></script>

        <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils_3d/control_utils_3d.js" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>

        <Script src="/newPose/model.js" strategy="lazyOnload" type="module"></Script>
      </Head>

      <div class="container" style={{ position: "relative" }}>
        <video id="webcam" style={{ width: "100vw", height: "100vh", objectFit: "cover" }} autoplay></video>
        <canvas
          class="output_canvas"
          id="output_canvas"
          style={{ position: "absolute", left: "0px", top: "0px", width: "100%", height: "50%", justifyContent: "center", alignItems: "center" }}
        ></canvas>
      </div>
    </div>
  );
}

export default Pose;
// "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"