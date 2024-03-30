const llmBackground = document.getElementById('llm-background');
const sentenceDelay = 1000; // Delay between each sentence in milliseconds

function generateSentence() {
    const phrases = [
        'market disruption', 'term sheet', 'due diligence', 'startup funding',
        'growth strategy', 'portfolio', 'seed round', 'venture capital',
        'series A funding', 'equity financing', 'board of directors',
        'return on investment', 'unicorn startup', 'pitch deck'
    ];
    
    const sentence = [];
    const length = Math.floor(Math.random() * 5) + 3; // Random sentence length between 3 and 7 phrases
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * phrases.length);
        sentence.push(phrases[randomIndex]);
    }
    
    return sentence.join(' ') + ' ';
}

function addSentence() {
    const line = document.createElement('div');
    line.className = 'llm-line';
    
    const sentenceCount = Math.floor(Math.random() * 3) + 1; // Random number of sentences per line (1 to 3)
    
    for (let i = 0; i < sentenceCount; i++) {
        const sentence = document.createElement('div');
        sentence.className = 'llm-sentence';
        sentence.textContent = generateSentence();
        line.appendChild(sentence);
    }
    
    llmBackground.appendChild(line);
}

function startStreaming() {
    setInterval(addSentence, sentenceDelay);
}

startStreaming();