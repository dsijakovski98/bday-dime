import * as faceApi from "face-api.js";
import JSConfetti from "js-confetti";

const jsConfetti = new JSConfetti();
const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const ctx = overlay.getContext("2d");
const message = document.getElementById("message");
const loading = document.getElementById("loading");

const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const birthdaySong = document.getElementById("bday-song");

const hatImg = new Image();
hatImg.src = "/assets/party-hat.png";

startBtn.addEventListener("click", async () => {
   startScreen.style.display = "none";
   loading.style.display = "flex";

   startBirthday();
});

async function startBirthday() {
   // Start webcam
   const stream = await navigator.mediaDevices.getUserMedia({ video: true });
   video.srcObject = stream;
   await video.play(); // ensures video is playing

   try {
      // Play song
      await birthdaySong.play();
      birthdaySong.loop = true;
   } catch (err) {
      console.warn("Autoplay blocked, song will play on user interaction");
   }

   // Set canvas size
   overlay.width = video.videoWidth;
   overlay.height = video.videoHeight;

   // Load face-api models
   await faceApi.nets.tinyFaceDetector.loadFromUri("/models");

   loading.style.display = "none";

   // Start detection loop
   detectFaces();
}

async function detectFaces() {
   const detections = await faceApi.detectAllFaces(video, new faceApi.TinyFaceDetectorOptions());

   ctx.clearRect(0, 0, overlay.width, overlay.height);

   detections.forEach((det) => {
      const { x, y, width, height } = det.box;
      ctx.drawImage(hatImg, x - width * 0.2, y - height * 1.2, width * 1.4, height);
   });

   // Show message + confetti
   if (detections.length > 0) {
      message.style.opacity = 1;
      jsConfetti.addConfetti({ confettiNumber: 10 });
   }

   if (detections.length && birthdaySong.paused) {
   }

   requestAnimationFrame(detectFaces);
}
