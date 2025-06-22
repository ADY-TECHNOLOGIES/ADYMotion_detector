const video = document.getElementById('video');
const motionStatus = document.getElementById('motion-status');

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
});

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let lastFrame = null;

function detectMotion() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

  if (lastFrame) {
    let diff = 0;
    for (let i = 0; i < currentFrame.data.length; i += 4) {
      diff += Math.abs(currentFrame.data[i] - lastFrame.data[i]);
    }
    if (diff > 1000000) {
      motionStatus.innerText = "Motion Detected!";
      motionStatus.style.color = "green";
      logMotion();
    } else {
      motionStatus.innerText = "No Motion";
      motionStatus.style.color = "red";
    }
  }

  lastFrame = currentFrame;
  requestAnimationFrame(detectMotion);
}

function logMotion() {
  fetch("/log-motion", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: "Motion detected by client" })
  }).then(res => res.json()).then(data => {
    console.log("Logged:", data);
  });
}

video.addEventListener('play', () => {
  detectMotion();
});
