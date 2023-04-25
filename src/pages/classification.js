import React, { useEffect } from 'react'
import Script from 'next/script'
import style from  '@/styles/style.module.css'

function Classification() {

    return (
        <>
            <div className={style.test}>
                <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js" type="text/javascript" ></Script>
                <Script src="/classification/model.js" strategy='lazyOnload' type='module'></Script>
                <main>

                    <h1>TensorFlow.js MNIST classifier</h1>

                    <p>See console for even more outputs.</p>



                    <section className={style.box}>

                        <h2>Input Image</h2>

                        <p>Input image is a 28x28 pixel greyscale image from MNIST dataset - a real hand drawn digit!</p>

                        <canvas className={style.clf} id="canvas" width="28" height="28"></canvas>

                    </section>

                    <section className={style.box}>

                        <h2>Prediction</h2>

                        <p>Below you see what number the trained TensorFlow.js model has predicted from the input image.</p>

                        <p>Red is a wrong prediction, Green is a correct one.</p>

                        <p id="prediction">Training model. Please wait...</p>

                    </section>
                </main>


            </div>
        </>

    )
}

export default Classification