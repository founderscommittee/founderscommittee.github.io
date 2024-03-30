const llmBackground = document.getElementById('llm-background');
const tokenLength = 5;

function generateToken() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < tokenLength; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

function addToken() {
    const token = document.createElement('span');
    token.className = 'llm-token';
    token.textContent = generateToken();
    llmBackground.appendChild(token);

    setTimeout(() => {
        token.remove();
    }, 2000);
}

setInterval(addToken, 200);