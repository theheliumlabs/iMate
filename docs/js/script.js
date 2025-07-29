document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const voiceButton = document.getElementById('voiceButton');
    const responseText = document.getElementById('responseText');
    const avatarHead = document.getElementById('avatarHead');
    const mouth = document.getElementById('mouth');
    const leftPupil = document.getElementById('leftPupil');
    const rightPupil = document.getElementById('rightPupil');
    const expressionButtons = document.querySelectorAll('.expression-btn');
    
    // API Configuration
    // const API_BASE_URL = 'http://localhost:5000'; // Update for production
    // Use relative path for GitHub Pages
    const API_BASE_URL = window.location.origin; 

// For local development:
// const API_BASE_URL = 'http://localhost:5000';
    // Set expression
    function setExpression(expression) {
        // Remove any existing expression classes
        const expressions = ['smile', 'laugh', 'angry', 'surprised', 'sad', 'neutral'];
        expressions.forEach(expr => avatarHead.classList.remove(expr));
        
        // Set the new expression
        avatarHead.classList.add(expression);
    }
    
    // Speak text using Web Speech API
    function speak(text) {
        if ('speechSynthesis' in window) {
            const synth = window.speechSynthesis;
            
            // Cancel any ongoing speech
            if (synth.speaking) {
                synth.cancel();
            }
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1;
            
            // Animate mouth while speaking
            let speakInterval;
            utterance.onstart = () => {
                let isOpen = false;
                speakInterval = setInterval(() => {
                    if (isOpen) {
                        mouth.style.height = "20px";
                        mouth.style.borderRadius = "0 0 40px 40px";
                    } else {
                        mouth.style.height = "10px";
                    }
                    isOpen = !isOpen;
                }, 200);
            };
            
            utterance.onend = () => {
                clearInterval(speakInterval);
                // Return to default mouth shape
                mouth.style.height = "20px";
                mouth.style.borderRadius = "0 0 40px 40px";
            };
            
            synth.speak(utterance);
        } else {
            console.warn('Text-to-speech not supported in this browser');
        }
    }
    
    // Send user input to backend
    async function sendToBackend(input) {
        try {
            const response = await fetch(`${API_BASE_URL}/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ input })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error communicating with backend:', error);
            return {
                text: "Sorry, I'm having trouble connecting to the server.",
                expression: "sad"
            };
        }
    }
    
    // Process user input
    async function processInput(input) {
        if (!input.trim()) return;
        
        // Send to backend
        const response = await sendToBackend(input);
        
        // Update UI with response
        responseText.textContent = response.text;
        setExpression(response.expression);
        speak(response.text);
        
        // Clear input
        userInput.value = '';
    }
    
    // Event Listeners
    sendButton.addEventListener('click', () => {
        processInput(userInput.value);
    });
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processInput(userInput.value);
        }
    });
    
    // Expression buttons
    expressionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const expression = button.getAttribute('data-expression');
            setExpression(expression);
            
            // Set response text based on expression
            const responses = {
                smile: "😊 I'm smiling now!",
                laugh: "😂 Hahaha! That's funny!",
                angry: "😠 Why did you make me angry?",
                surprised: "😮 Wow! You surprised me!",
                sad: "😢 Now I'm feeling sad...",
                neutral: "😐 Back to normal."
            };
            
            responseText.textContent = responses[expression] || "Expression changed.";
            speak(responseText.textContent);
        });
    });
    
    // Voice button (simplified)
    voiceButton.addEventListener('click', () => {
        responseText.textContent = "Voice commands coming soon!";
        speak(responseText.textContent);
    });
    
    // Eye tracking effect
    document.addEventListener('mousemove', (e) => {
        const avatarRect = avatarHead.getBoundingClientRect();
        const avatarCenterX = avatarRect.left + avatarRect.width / 2;
        const avatarCenterY = avatarRect.top + avatarRect.height / 2;
        
        const angle = Math.atan2(e.clientY - avatarCenterY, e.clientX - avatarCenterX);
        const distance = Math.min(6, Math.hypot(e.clientX - avatarCenterX, e.clientY - avatarCenterY) / 50);
        
        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;
        
        leftPupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        rightPupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    // Initial greeting
    setTimeout(() => {
        responseText.textContent = "Hello! I'm iMate. Say something to me!";
        speak(responseText.textContent);
    }, 1000);
});