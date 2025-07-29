document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const speakButton = document.getElementById('speakButton');
    const responseText = document.getElementById('responseText');
    const responseBubble = document.getElementById('responseBubble');
    const mouth = document.querySelector('.mouth');
    const head = document.querySelector('.head');

    // Initialize Speech Synthesis
    const synth = window.speechSynthesis;
    
    function speak(text) {
        if (synth.speaking) {
            synth.cancel();
        }
        
        // Update speech bubble
        responseText.textContent = text;
        responseBubble.style.display = 'block';
        
        // Start speaking animation
        head.classList.add('speaking');
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onstart = () => {
            // Visual talking effect
            const animateMouth = () => {
                if (synth.speaking) {
                    mouth.classList.toggle('speaking');
                    setTimeout(animateMouth, 200);
                }
            };
            animateMouth();
        };
        
        utterance.onend = () => {
            // Stop animation
            head.classList.remove('speaking');
            mouth.classList.remove('speaking');
        };
        
        synth.speak(utterance);
    }

    // Event Listeners
    speakButton.addEventListener('click', () => {
        const text = userInput.value.trim();
        if (text) {
            speak(text);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = userInput.value.trim();
            if (text) {
                speak(text);
                userInput.value = '';
            }
        }
    });

    // Initial greeting
    setTimeout(() => speak("Hi! I'm iMate. Say something to me!"), 1000);
});