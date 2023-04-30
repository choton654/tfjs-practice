import React from 'react'
import Script from 'next/script';


function Transferlearningcmp() {

    return (
        <div>
            <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js" type="text/javascript" ></Script>
            <Script src="/transfer/model.js" strategy='lazyOnload' type='module'></Script>
            <h1 style={{
                fontStyle: 'italic',
                color: '#FF6F00'
            }}>Make your own "Teachable Machine" using Transfer Learning with MobileNet v3 in TensorFlow.js using saved graph model from TFHub.</h1>



            <p id="status" style={{ fontSize: '150%' }}>Awaiting TF.js load</p>



            <video id="webcam" autoPlay style={{
                clear: 'both',

                display: 'block',

                margin: '10px',

                background: '#000000',

                width: '640px',

                height: '480px',
            }}></video>



            <button id="enableCam" >Enable Webcam</button>

            <button className="dataCollector" data-1hot="0" data-name="Class 1">Gather Class 1 Data</button>

            <button className="dataCollector" data-1hot="1" data-name="Class 2">Gather Class 2 Data</button>

            <button id="train" >Train &amp; Predict!</button>

            <button id="reset" >Reset</button>
        </div>
    )
}

export default Transferlearningcmp