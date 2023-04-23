// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import axios from "axios"
// import { TRAINING_DATA } from "https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/real-estate-data.js"
export default async function handler(req, res) {
  // const {data} = await axios.get("https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/real-estate-data.js")
  // console.log('---data--',data);
  res.status(200).json({ name: 'John Doe' })
}
