const themeToggle = document.getElementById('theme-toggle');
const textModeRadio = document.getElementById('text-mode');
const voiceModeRadio = document.getElementById('voice-mode');
const micBtn = document.getElementById('mic-btn');
const translateBtn = document.getElementById('translate-btn');
const sourceText = document.getElementById('source-text');
const targetText = document.getElementById('target-text');
const sourceLang = document.getElementById('source-lang');
const targetLang = document.getElementById('target-lang');
const copyBtn = document.getElementById('copy-btn');
const feedbackFab = document.getElementById('feedback-fab');
const feedbackModal = document.getElementById('feedback-modal');
const closeModal = document.querySelector('.close-modal');
const feedbackForm = document.getElementById('feedback-form');

// --- Dark Mode Logic ---
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggle.checked = true;
    }
}

themeToggle.addEventListener('change', function (e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

// --- Mode Toggle Logic ---
function updateMode() {
    if (voiceModeRadio.checked) {
        micBtn.classList.remove('hidden');
        sourceText.placeholder = "Listening... or type here";
    } else {
        micBtn.classList.add('hidden');
        sourceText.placeholder = "Enter text here...";
    }
}

textModeRadio.addEventListener('change', updateMode);
voiceModeRadio.addEventListener('change', updateMode);

// Initialize mode
updateMode();

// --- Speech to Text (Basic) ---
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = sourceLang.value;

    micBtn.addEventListener('click', () => {
        if (micBtn.classList.contains('listening')) {
            recognition.stop();
        } else {
            // Update lang to match source selection
            recognition.lang = sourceLang.value;
            recognition.start();
            micBtn.classList.add('listening');
            micBtn.style.backgroundColor = '#e74c3c'; // Recording color
        }
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        sourceText.value = transcript;
        micBtn.classList.remove('listening');
        micBtn.style.backgroundColor = ''; // Reset color
    };

    recognition.onend = () => {
        micBtn.classList.remove('listening');
        micBtn.style.backgroundColor = '';
    };

    recognition.onerror = () => {
        micBtn.classList.remove('listening');
        micBtn.style.backgroundColor = '';
        alert('Voice input error or not allowed.');
    };

    // Update recognition language when source language changes
    sourceLang.addEventListener('change', () => {
        recognition.lang = sourceLang.value;
    });

} else {
    // Hide mic button if not supported
    micBtn.style.display = 'none';
    console.log("Web Speech API not supported");
}


// --- Translation Logic ---
translateBtn.addEventListener('click', () => {
    let text = sourceText.value;
    let translateFrom = sourceLang.value;
    let translateTo = targetLang.value;

    if (!text) {
        alert("Please enter some text to translate.");
        return;
    }

    targetText.setAttribute('placeholder', 'Translating...');
    targetText.value = "";

    // Call Python Backend
    fetch('/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text,
            source_lang: translateFrom,
            target_lang: translateTo
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                targetText.value = "Error: " + data.error;
            } else {
                targetText.value = data.translatedText;
            }
        })
        .catch(err => {
            console.error("Error:", err);
            targetText.value = "Error connecting to server.";
        });
});

// --- Copy Button ---
copyBtn.addEventListener('click', () => {
    if (targetText.value) {
        navigator.clipboard.writeText(targetText.value);
        // Tooltip feedback
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
        }, 1500);
    }
});


// --- Feedback Modal Logic ---
feedbackFab.addEventListener('click', () => {
    feedbackModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    feedbackModal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
    if (e.target === feedbackModal) {
        feedbackModal.classList.add('hidden');
    }
});

feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const problem = document.getElementById('problem').value;
    const suggestion = document.getElementById('suggestion').value;

    const submitBtn = feedbackForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerText;

    submitBtn.innerText = 'Sending...';

    // Call Python Backend
    fetch('/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            problem: problem,
            suggestion: suggestion
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                submitBtn.innerText = 'Sent!';
                submitBtn.style.backgroundColor = '#2ecc71';

                setTimeout(() => {
                    feedbackForm.reset();
                    feedbackModal.classList.add('hidden');
                    submitBtn.innerText = originalText;
                    submitBtn.style.backgroundColor = '';
                }, 1000);
            } else {
                alert('Error sending feedback: ' + (data.error || 'Unknown error'));
                submitBtn.innerText = originalText;
            }
        })
        .catch(err => {
            console.error("Error:", err);
            alert('Failed to connect to server.');
            submitBtn.innerText = originalText;
        });
});
