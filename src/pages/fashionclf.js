import Script from 'next/script'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-converter'
import '@tensorflow/tfjs-backend-webgl'
import * as tf from "@tensorflow/tfjs";
import style from '@/styles/style.module.css'

function Fashionclf() {

    const [INPUTS, setInputs] = useState(null)
    const [OUTPUTS, setOutputs] = useState(null)
    const domSpeedref = useRef(null)
    const rangerref = useRef(null)
    const perdref = useRef(null)
    const canvref = useRef(null)

    var interval = 2000;

    useEffect(() => {
        // When user drags slider update interval.

        rangerref.current.addEventListener('input', function (e) {

            interval = this.value;

            domSpeedref.current.innerText = 'Change speed of classification! Currently: ' + interval + 'ms';

        });
    }, [rangerref, domSpeedref])


    useEffect(() => {

        setTimeout(() => {
            setInputs(window.FASHION_INPUTS); setOutputs(window.FASHION_OUTPUTS)
        }, 2000);
    }, [INPUTS, OUTPUTS])

    console.log(INPUTS, OUTPUTS);

    function normalize(tensor, min, max) {
        const result = tf.tidy(function () {
            const MIN_VALUES = tf.scalar(min);

            const MAX_VALUES = tf.scalar(max);
            const TENSOR_SUBTRACT_MIN_VALUE = tf.sub(tensor, MIN_VALUES);

            const RANGE_SIZE = tf.sub(MAX_VALUES, MIN_VALUES);

            const NORMALIZED_VALUES = tf.div(TENSOR_SUBTRACT_MIN_VALUE, RANGE_SIZE);

            return NORMALIZED_VALUES;
        });
        return result;
    }

    useMemo(() => {
        if (INPUTS && OUTPUTS) {
            // Input feature Array is 2 dimensional.
            const INPUTS_TENSOR = normalize(tf.tensor2d(INPUTS), 0, 255)

            const OUTPUTS_TENSOR = OUTPUTS && tf.oneHot(tf.tensor1d(OUTPUTS, 'int32'), 10);
            // Map output index to label.

            const LOOKUP = ['T-shirt', 'Trouser', 'Pullover', 'Dress', 'Coat', 'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot'];

            const logProgress = (epoch, logs) => {
                console.log('Data for epoch ' + epoch, logs);

            }

            const model = tf.sequential()

            model.add(tf.layers.conv2d({
                inputShape: [28, 28, 1],
                filters: 16,
                kernelSize: 3,
                strides: 1,
                padding: 'same',
                activation: 'relu'
            }))

            model.add(tf.layers.maxPooling2d({
                poolSize: 2, strides: 2
            }))

            model.add(tf.layers.conv2d({
                filters: 32,
                kernelSize: 3,
                strides: 1,
                padding: 'same',
                activation: 'relu'
            }))

            model.add(tf.layers.maxPooling2d({
                poolSize: 2, strides: 2
            }))

            model.add(tf.layers.flatten())

            model.add(tf.layers.dense({ units: 128, activation: 'relu' }))

            model.add(tf.layers.dense({ units: 10, activation: 'softmax' }))

            model.summary()

            train()

            async function train() {
                model.compile({
                    optimizer: 'adam',
                    loss: 'categoricalCrossentropy',
                    metrics: ['accuracy']
                });


                const RESHAPE_INPUTS = INPUTS_TENSOR.reshape([INPUTS.length, 28, 28, 1])
                // Finally do the training itself 
                await model.fit(RESHAPE_INPUTS, OUTPUTS_TENSOR, {
                    callbacks: { onEpochEnd: logProgress },
                    validationSplit: 0.15,
                    shuffle: true,         // Ensure data is shuffled again before using each epoch.
                    batchSize: 256,         // As we have a lot of training data, batch size is set to 64.
                    epochs: 30             // Go over the data 10 times!
                });


                RESHAPE_INPUTS.dispose();
                OUTPUTS_TENSOR.dispose();
                INPUTS_TENSOR.dispose();


                // Once trained we can evaluate the model.
                evaluate();
            }

            function evaluate() {

                const OFFSET = Math.floor((Math.random() * INPUTS.length)); // Select random from all example inputs. 



                let answer = tf.tidy(function () {

                    let newInput = normalize(tf.tensor1d(INPUTS[OFFSET]), 0, 255);



                    let output = model.predict(newInput.reshape([1, 28, 28, 1]));

                    output.print();

                    return output.squeeze().argMax();

                });
                answer.array().then(function (index) {

                    perdref.current.innerText = LOOKUP[index];

                    perdref.current.setAttribute('class', (index === OUTPUTS[OFFSET]) ? 'correct' : 'wrong');

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
        <div>
            <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js" type="text/javascript" ></Script>
            <Script src="/fashionclf/model.js" strategy='lazyOnload' type='module'></Script>
            <div className="blocky">

                <p id="domSpeed" ref={domSpeedref}>Change interval between classifications! Currently 1000ms</p>

                <input id="ranger" ref={rangerref} type="range" min="15" max="5000" value={interval} className="slider" />

            </div>
            <section className={style.box}>

                <h1>TensorFlow.js Fashion MNIST classifier</h1>

                <p>This experiment shows how you can use the power of Machine Learning directly in your browser to train and use a more advanced Convolutional Neural Network to classify clothing items from the Fashion MNIST dataset. Warning training is slow in browser, ideally you would do this in Node.js with CUDA installed for faster training. In the browser without CUDA it will take about 5 mins to train, and then inference will be super fast :-)</p>

                <canvas className={style.clf} ref={canvref} id="canvas" width="28" height="28"></canvas>
            </section>

            <section className={style.box}>

                <h2>Prediction</h2>

                <p>Below you see what item the trained TensorFlow.js model has predicted from the input image.</p>

                <p>It should get it right most of the time, but of course it's not perfect, so there will be times when it doesn't. Red is a wrong prediction, Green is a correct one.</p>

                <p id="prediction" ref={perdref}>Training model. Please wait. This can take ~5 minutes. Check console for progress (30 epochs total)</p>

            </section>
        </div>
    )
}

export default Fashionclf