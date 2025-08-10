const avatar = document.getElementById("avatar");
const startBtn = document.getElementById("start-btn");
const smileBtn = document.getElementById("smile-btn");
const laughBtn = document.getElementById("laugh-btn");

// Avatar image paths
const idleImg = "assets/idle.png";                 // Neutral
const talkingImgs = ["assets/idle.png", "assets/talking.png"]; // Two frames for mouth animation
const smileImg = "assets/smile.png";
const laughImg = "assets/laugh.png";
const laughTearsImg = "assets/laugh_tears.png";

// Voice recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;

// Function to speak text
function speak(text) {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    let talkingInterval;
    utterance.onstart = () => {
      let frame = 0;
      talkingInterval = setInterval(() => {
        avatar.src = talkingImgs[frame % talkingImgs.length];
        frame++;
      }, 200); // change frame every 200ms
    };

    utterance.onend = () => {
      clearInterval(talkingInterval);
      avatar.src = idleImg;
      resolve();
    };

    speechSynthesis.speak(utterance);
  });
}

// 🎤 Speak button
startBtn.addEventListener("click", () => {
  avatar.src = idleImg;
  recognition.start();
});

// When recognition result comes
recognition.onresult = async (event) => {
  const userText = event.results[0][0].transcript;
  await speak(userText);
};

// 😊 Smile button
smileBtn.addEventListener("click", () => {
  avatar.src = smileImg;
  setTimeout(() => avatar.src = idleImg, 2000);
});

// 😂 Laugh button
laughBtn.addEventListener("click", () => {
  avatar.src = laughTearsImg;
  setTimeout(() => avatar.src = idleImg, 2000);
});
