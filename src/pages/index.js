'use client';
import * as tf from '@tensorflow/tfjs';
import { useEffect, useRef, useState } from 'react';
const circle = "/circle.png";
export default function Home() {

  // // Define a model for linear regression.
  // const model = tf.sequential();
  // model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  // // Prepare the model for training: Specify the loss and the optimizer.
  // model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  // // Generate some synthetic data for training.
  // const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  // const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

  // // Train the model using the data.
  // model.fit(xs, ys).then(() => {
  //   // Use the model to do inference on a data point the model hasn't seen before:
  //   model.predict(tf.tensor2d([5], [1, 1])).print();
  // });
  const [points, setpoints] = useState([])
  const imgRef = useRef(null)
  const circleRef = useRef(null)
  const canvRef = useRef(null)

  const MODEL_PATH = 'https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4'

  let moveNet = undefined

  const loadAndRunModel = async (imgData) => {
    try {

      moveNet = await tf.loadGraphModel(MODEL_PATH, { fromTFHub: true })

      console.log('runnn', moveNet)
      let exampleInputTensor = tf.zeros([1, 192, 192, 3], 'int32')
      let imageTensor = tf.browser.fromPixels(imgData)
      console.log('---img tensor---', imageTensor.shape);

      let cropStartPoint = [15, 170, 0]
      let cropSize = [345, 345, 3]
      let cropTensor = tf.slice(imageTensor, cropStartPoint, cropSize)

      let resizeTensor = tf.image.resizeBilinear(cropTensor, [192, 192], true).toInt()
      console.log('---resize tensor---', resizeTensor.shape);

      let tensorOutput = moveNet.predict(tf.expandDims(resizeTensor))
      let arrayOutput = await tensorOutput.array()
      console.log('------', arrayOutput);
      setpoints(arrayOutput[0][0])
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    (async () => { await loadAndRunModel(imgRef.current) })()
  }, [imgRef])

  useEffect(() => {
    if (canvRef && imgRef && circleRef) {
      const c = canvRef.current
      const img = imgRef.current
      const circle = circleRef.current
      var ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height,);
      if (points.length > 0) {
        points.forEach(p => {
          const x = p[1] * 192
          const y = p[0] * 192
          ctx.drawImage(circle, x, y, circle.width, circle.height,);
  
        })
        
      }
      // console.log('---canvRef---', ctx, img);

   }
  }, [canvRef,imgRef, circleRef, points.length])

  

  return (
    <>
      <div style={{}}>

        <img ref={imgRef} width={640} height={360} crossOrigin='anonymous'
          // src='https://images.unsplash.com/photo-1470468969717-61d5d54fd036?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=744&q=80'
          src='https://images.unsplash.com/photo-1517438984742-1262db08379e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=680&q=80'
        />
        <img ref={circleRef} src={circle} width={20} height={20} />
        <canvas ref={canvRef} id="myCanvas" width={640} height={360} style={{ border: '1px solid #000' }}></canvas>
      
      </div>
    </>
  )
}
