const llmBackground = document.getElementById('llm-background');
const sentenceLength = 5;

function generateSentence() {
    const words = ['innovation', 'technology', 'future', 'AI', 'blockchain', 'startup', 'venture', 'capital', 'investment', 'growth'];
    let sentence = '';
    for (let i = 0; i < sentenceLength; i++) {
        sentence += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    return sentence.trim();
}

function addSentence() {
    const sentence = document.createElement('div');
    sentence.className = 'llm-sentence';
    sentence.textContent = generateSentence();
    llmBackground.appendChild(sentence);

    setTimeout(() => {
        sentence.remove();
    }, 3000);
}

setInterval(addSentence, 1000);