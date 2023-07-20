const fileInput = document.getElementById('fileInput');
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvasContext = canvasElement.getContext('2d');


posenet.load().then((net) => {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      videoElement.src = URL.createObjectURL(file);
      await videoElement.play();
      processFrame(net);
    });
  });
  
  async function processFrame(net) {
    canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    const image = tf.browser.fromPixels(canvasElement);
    const poses = await net.estimateMultiplePoses(image);
    console.log('---poses---',poses);
    poses.forEach((pose) => {
      drawKeypoints(pose.keypoints, 0.8);
    });
  
    image.dispose();
    requestAnimationFrame(() => processFrame(net));
  }


function drawKeypoints(keypoints, minConfidence) {
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];
        const { y, x, } = keypoint.position;

        if (keypoint.score >= minConfidence) {
            console.log('---draw---');
            canvasContext.beginPath();
            canvasContext.arc(x, y, 3, 0, 2 * Math.PI);
            // canvasContext.fillRect(x, y, 5, 5);
            canvasContext.fillStyle = '#000';
            canvasContext.fill();
            canvasContext.closePath();
        }
    }
}