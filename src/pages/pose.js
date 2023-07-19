import React from 'react'
import Script from 'next/script';


function Pose() {

    return (
        <div>
            <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet"></script>
            {/* <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet@3.4.0/dist/posenet.min.js"></script> */}
            <Script src="/pose/model.js" strategy='lazyOnload' type='module'></Script>

          
            <input type="file" id="fileInput" accept="video/mp4"/>
            <video id="video" width="640" height="480" controls></video>
            <canvas id="canvas" width="640" height="480"></canvas>



        </div>
    )
}

export default Pose