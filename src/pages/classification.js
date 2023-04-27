import React, { useEffect, useMemo, useRef, useState } from 'react'
import '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-converter'
import '@tensorflow/tfjs-backend-webgl'
import Script from 'next/script'
import style from '@/styles/style.module.css'
import * as tf from "@tensorflow/tfjs";

const isServer = () => typeof window !== 'undefined';

function Classification() {
    const [INPUTS, setInputs] = useState(null)
    const [OUTPUTS, setOutputs] = useState(null)
    const predRef = useRef(null)
    const canvref = useRef(null)

    useEffect(() => {

        setTimeout(() => {
            setInputs(window.INPUTS); setOutputs(window.OUTPUTS)
        }, 2000);
    }, [])

    useMemo(() => {

        if (INPUTS && OUTPUTS) {
            tf.util.shuffleCombo(INPUTS, OUTPUTS);

            // Input feature Array is 1 dimensional.

            const INPUTS_TENSOR = INPUTS && tf.tensor2d(INPUTS);

            // Output feature Array is 1 dimensional.

            const OUTPUTS_TENSOR = OUTPUTS && tf.oneHot(tf.tensor1d(OUTPUTS, 'int32'), 10);
            console.log('---TRAINING_DATA---', INPUTS, OUTPUTS);
            const logProgress = (epoch, logs) => {
                console.log('Data for epoch ' + epoch, logs);

            }
            const model = tf.sequential()

            model.add(tf.layers.dense({ inputShape: [784], units: 32, activation: 'relu' }))
            model.add(tf.layers.dense({ units: 16, activation: 'relu' }))
            model.add(tf.layers.dense({ units: 10, activation: 'softmax' }))

            model.summary()

            train()

            async function train() {
                model.compile({
                    optimizer: 'adam',
                    loss: 'categoricalCrossentropy',
                    metrics: ['accuracy']
                });

                // Finally do the training itself 
                await model.fit(INPUTS_TENSOR, OUTPUTS_TENSOR, {
                    callbacks: { onEpochEnd: logProgress },
                    validationSplit: 0.2,
                    shuffle: true,         // Ensure data is shuffled again before using each epoch.
                    batchSize: 512,         // As we have a lot of training data, batch size is set to 64.
                    epochs: 50             // Go over the data 10 times!
                });

                OUTPUTS_TENSOR.dispose();
                INPUTS_TENSOR.dispose();


                // Once trained we can evaluate the model.
                evaluate();
            }

            function evaluate() {

                const OFFSET = Math.floor((Math.random() * INPUTS.length)); // Select random from all example inputs. 



                let answer = tf.tidy(function () {

                    let newInput = tf.tensor1d(INPUTS[OFFSET]).expandDims();



                    let output = model.predict(newInput);

                    output.print();

                    return output.squeeze().argMax();

                });
                answer.array().then(function (index) {

                    predRef.current.innerText = index;

                    predRef.current.setAttribute('class', (index === OUTPUTS[OFFSET]) ? 'correct' : 'wrong');

                    answer.dispose();

                    drawImage(INPUTS[OFFSET]);

                });
            }


            const CTX = canvref.current.getContext('2d');


            function drawImage(digit) {

                var imageData = CTX.getImageData(0, 0, 28, 28);



                for (let i = 0; i < digit.length; i++) {

                    imageData.data[i * 4] = digit[i] * 255;      // Red Channel.

                    imageData.data[i * 4 + 1] = digit[i] * 255;  // Green Channel.

                    imageData.data[i * 4 + 2] = digit[i] * 255;  // Blue Channel.

                    imageData.data[i * 4 + 3] = 255;             // Alpha Channel.

                }


                // Render the updated array of data to the canvas itself.

                CTX.putImageData(imageData, 0, 0);


                // Perform a new classification after a certain interval.

                setTimeout(evaluate, 2000);

            }

        }
    }, [INPUTS, OUTPUTS])


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

                        <canvas className={style.clf} ref={canvref} id="canvas" width="28" height="28"></canvas>

                    </section>

                    <section className={style.box}>

                        <h2>Prediction</h2>

                        <p>Below you see what number the trained TensorFlow.js model has predicted from the input image.</p>

                        <p>Red is a wrong prediction, Green is a correct one.</p>

                        <p id="prediction" ref={predRef}>Training model. Please wait...</p>

                    </section>
                </main>


            </div>
        </>

    )
}

export default Classification