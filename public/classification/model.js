
import {TRAINING_DATA} from 'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/mnist.js';


// Grab a reference to the MNIST input values (pixel data).

const INPUTS = TRAINING_DATA.inputs;


// Grab reference to the MNIST output values.

const OUTPUTS = TRAINING_DATA.outputs;
console.log('---TRAINING_DATA---',TRAINING_DATA);

// Shuffle the two arrays in the same way so inputs still match outputs indexes.

tf.util.shuffleCombo(INPUTS, OUTPUTS);


// Input feature Array is 1 dimensional.

const INPUTS_TENSOR = tf.tensor2d(INPUTS);


// Output feature Array is 1 dimensional.

const OUTPUTS_TENSOR = tf.oneHot(tf.tensor1d(OUTPUTS, 'int32'), 10);