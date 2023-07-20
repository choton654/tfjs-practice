const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvasContext = canvasElement.getContext('2d');
let isDetectingPushUp = false;
let pushUpCount = 0;
let isPushUpInProgress = false;
const scoreThreshold = 0.5; // Adjust this threshold to filter out keypoints with lower scores

// Load the PoseNet model
posenet.load().then((net) => {
  const fileInput = document.getElementById('fileInput');
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    videoElement.src = URL.createObjectURL(file);
    await videoElement.play();
    isDetectingPushUp = true;
    detectPushUps(net);
  });
});

async function detectPushUps(net) {
  if (!isDetectingPushUp) return;

  canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  const image = tf.browser.fromPixels(canvasElement);
  const poses = await net.estimateMultiplePoses(image, {
    flipHorizontal: false, // Set to true if the video is mirrored
    maxDetections: 1,
    scoreThreshold: scoreThreshold
  });

  if (poses.length >= 1) {
    const pushUpDetected = isPushUpPose(poses[0]);
    if (pushUpDetected) {
      if (!isPushUpInProgress) {
        pushUpCount++;
        console.log(`Push-up Count: ${pushUpCount}`);
        isPushUpInProgress = true;
      }
    } else {
      isPushUpInProgress = false;
    }
  }

  image.dispose();
  requestAnimationFrame(() => detectPushUps(net));
}

function isPushUpPose(pose) {
  // Define criteria for push-up pose detection.
  // For example, check if keypoints for hands, shoulders, hips, and head are aligned correctly.

  const leftShoulder = pose.keypoints.find((keypoint) => keypoint.part === 'leftShoulder');
  const rightShoulder = pose.keypoints.find((keypoint) => keypoint.part === 'rightShoulder');
  const leftHip = pose.keypoints.find((keypoint) => keypoint.part === 'leftHip');
  const rightHip = pose.keypoints.find((keypoint) => keypoint.part === 'rightHip');
  const leftWrist = pose.keypoints.find((keypoint) => keypoint.part === 'leftWrist');
  const rightWrist = pose.keypoints.find((keypoint) => keypoint.part === 'rightWrist');
  const nose = pose.keypoints.find((keypoint) => keypoint.part === 'nose');

  // Example criteria: Check if wrists are below the shoulders and the head is above the hips.
  if (leftWrist.score >= scoreThreshold &&
    rightWrist.score >= scoreThreshold &&
    leftShoulder.score >= scoreThreshold &&
    rightShoulder.score >= scoreThreshold &&
    leftHip.score >= scoreThreshold &&
    rightHip.score >= scoreThreshold &&
    nose.score >= scoreThreshold
  ) {
    const wristsAboveShoulders = leftWrist.position.y > leftShoulder.position.y &&
      rightWrist.position.y > rightShoulder.position.y;
    const headAboveHips = nose.position.y < (leftHip.position.y + rightHip.position.y) / 2;

    return wristsAboveShoulders && headAboveHips;
  }

  return false;
}
