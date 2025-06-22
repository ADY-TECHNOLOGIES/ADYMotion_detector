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
const video = document.querySelector("video");
const statusText = document.getElementById("status");

let prevFrame = null;

navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
    video.play();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    setInterval(() => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (prevFrame) {
        let diff = 0;
        for (let i = 0; i < currentFrame.data.length; i += 4) {
          diff += Math.abs(currentFrame.data[i] - prevFrame.data[i]);
        }

        if (diff > 1000000) {  // adjust threshold as needed
          statusText.innerText = "Motion Detected!";
          sendMotion();
          sendSnapshot(canvas.toDataURL('image/jpeg'));
        } else {
          statusText.innerText = "No Motion";
        }
      }

      prevFrame = currentFrame;
    }, 1000);
  });

function sendMotion() {
  fetch("/log-motion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Motion Detected" }),
  });
}

function sendSnapshot(base64Image) {
  fetch("/save-snapshot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });
}

