const avatar = document.getElementById("avatar");
const startBtn = document.getElementById("start-btn");
const smileBtn = document.getElementById("smile-btn");
const laughBtn = document.getElementById("laugh-btn");

// Images
const idleImg = "assets/idle.png";
const talkingImgs = ["assets/idle.png", "assets/talking.png"];
const smileImg = "assets/smile.png";
const laughTearsImg = "assets/laugh_tears.png";

// Speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;

// Speak with mouth animation
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
      }, 200);
    };

    utterance.onend = () => {
      clearInterval(talkingInterval);
      avatar.src = idleImg;
      resolve();
    };

    speechSynthesis.speak(utterance);
  });
}

// Call DeepSeek API through backend
async function getAIResponse(userText) {
  const response = await fetch("https://your-site.netlify.app/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: userText })
  });
  const data = await response.json();
  return data.reply;
}

// 🎤 Speak button
startBtn.addEventListener("click", () => {
  avatar.src = idleImg;
  recognition.start();
});

// When recognition finishes
recognition.onresult = async (event) => {
  const userText = event.results[0][0].transcript;
  const aiReply = await getAIResponse(userText);
  await speak(aiReply);
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
