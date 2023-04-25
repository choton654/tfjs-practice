
'use client';

import React from "react";
import Script from 'next/script'

function HousePrice() {

  return <>
    <div>
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js" type="text/javascript" ></Script>
      <Script src="/houseprice/model.js" strategy='lazyOnload' type='module'></Script>
      <h1>TensorFlow.js Linear Regression using single nuron</h1>
    </div>
  </>;
}

export default HousePrice;
