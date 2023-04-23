
'use client';

import React, { useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// import { TRAINING_DATA } from "https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/real-estate-data.js";
import { TRAINING_DATA } from '../data/houseTrainingdata'


// Input feature pairs (House size, Number of bedrooms)
const INPUTS = TRAINING_DATA.inputs;

// Current listed house prices in dollars given their features above (target output values you want to predict)
const OUTPUTS = TRAINING_DATA.outputs;

function HousePrice() {

  // console.log("---TRAINING_DATA---", TRAINING_DATA);
  tf.util.shuffleCombo(INPUTS, OUTPUTS);

  const INPUT_TENSOR = tf.tensor2d(INPUTS)
  const OUTPUT_TENSOR = tf.tensor1d(OUTPUTS)

  // function to take a Tensor and normalize values
  const normalize = (tensor, min, max) => {
    const result = tf.tidy(() => {

      // find minimum value contained in the tensor
      const MIN_VALUES = min || tf.min(tensor, 0)

      // find maximum value contained in the tensor
      const MAX_VALUES = max || tf.max(tensor, 0)

      // now subtract the MIN_VALUE from every value in the tensor
      // and store the result in a new tensor
      const TENSOR_SUBTRACT_MIN_VALUE = tf.sub(tensor, MIN_VALUES)

      // calculate the range size of the possible value
      const RANGE_SIZE = tf.sub(MAX_VALUES, MIN_VALUES);

      // calculate the adjusted values divided by the range size as a new tensor 
      const NORMALIZED_VALUES = tf.div(TENSOR_SUBTRACT_MIN_VALUE, RANGE_SIZE)

      return { NORMALIZED_VALUES, MIN_VALUES, MAX_VALUES }
    })
    return result
  }


  // Normalize all input features array and the dispose of the original non normalize tensor
  const FEATURE_RESULTS = normalize(INPUT_TENSOR)

  console.log('Normalize values');
  FEATURE_RESULTS.NORMALIZED_VALUES.print()


  console.log('Min values');
  FEATURE_RESULTS.MIN_VALUES.print()


  console.log('Max values');
  FEATURE_RESULTS.MAX_VALUES.print()

  INPUT_TENSOR.dispose()

  // create and define a model
  const model = tf.sequential()

  // use one dense layer with 1 nuron (units) and an input of 2 input feature values (representing house size and number of rooms)
  model.add(tf.layers.dense({ inputShape: [2], units: 1 }))

  model.summary()



  const train = async () => {
    const LEARNING_RATE = 0.01 // choose learning rate suitable for data

    //  Compile the model with defined learning rate and specify a loss function to use
    model.compile({ optimizer: tf.train.sgd(LEARNING_RATE), loss: 'meanSquaredError' })

    // Finally to do the training itself
    let result = await model.fit(FEATURE_RESULTS.NORMALIZED_VALUES, OUTPUT_TENSOR,
      {
        validationSplit: 0.15, // take 15% of the data to use for validation testing
        shuffle: true, // ensure data is shuffled in case it was in order
        batchSize: 64, // as there are lots of training data, batch size is 64
        epochs: 10 // Go over data 10 times
      })

    OUTPUT_TENSOR.dispose()
    FEATURE_RESULTS.NORMALIZED_VALUES.dispose()

    console.log('Average error loss: ' + Math.sqrt(result.history.loss[result.history.loss.length - 1]));
    console.log('Average validation error loss: ' + Math.sqrt(result.history.val_loss[result.history.val_loss.length - 1]));

    evaluate(); // once trained evaluate the model
  }


  const evaluate = () => {
    // Predict answer for a sinle piece of data
    tf.tidy(() => {
      let newInput = normalize(tf.tensor2d([[750, 2]]), FEATURE_RESULTS.MIN_VALUES, FEATURE_RESULTS.MAX_VALUES)

      let output = model.predict(newInput.NORMALIZED_VALUES)
      console.log('Prediction value---');
      output.print()

    })

    FEATURE_RESULTS.MAX_VALUES.dispose()
    FEATURE_RESULTS.MIN_VALUES.dispose()
    model.dispose()

    console.log(tf.memory().numTensors);
  }

  train()


  return <h1>TensorFlow.js Linear Regression using single nuron</h1>;
}

export default HousePrice;
