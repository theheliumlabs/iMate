const avatar = document.getElementById("avatar");
const startBtn = document.getElementById("start-btn");
const smileBtn = document.getElementById("smile-btn");
const laughBtn = document.getElementById("laugh-btn");

// Images
const idleImg = "assets/idle.png";
const smileImg = "assets/smile.png";
const laughImg = "assets/laugh.png";
const talkingImg = "assets/talking.gif";

// Voice recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

// Speech synthesis
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}

startBtn.addEventListener("click", () => {
  avatar.src = idleImg;
  recognition.start();
});

recognition.onresult = (event) => {
  const userText = event.results[0][0].transcript;
  avatar.src = talkingImg;
  speak(userText);

  // Reset to idle after speaking
  setTimeout(() => {
    avatar.src = idleImg;
  }, userText.length * 200);
};

smileBtn.addEventListener("click", () => {
  avatar.src = smileImg;
  setTimeout(() => avatar.src = idleImg, 2000);
});

laughBtn.addEventListener("click", () => {
  avatar.src = laughImg;
  setTimeout(() => avatar.src = idleImg, 2000);
});
