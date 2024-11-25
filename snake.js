class SnakeGame {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.canvas.style.border = '2px solid transparent';
        this.canvas.style.borderRadius = '12px';
        this.canvas.style.background = 'linear-gradient(45deg, #f3f4f6 0%, #ffffff 100%)';
        this.canvas.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';

        this.gridSize = 20;
        this.snake = [{ x: 10, y: 10 }];
        this.food = this.generateFood();
        this.direction = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.gameSpeed = 100;
        this.gameStarted = false;

        this.colors = {
            snake: {
                head: '#3B82F6',
                body: '#60A5FA',
                outline: '#2563EB'
            },
            food: {
                fill: '#EF4444',
                outline: '#DC2626'
            },
            grid: '#E5E7EB'
        };

        this.modal = document.createElement('div');
        this.setupModal();
        this.setupControls();
        this.startGame();
    }

    setupModal() {
        this.modal.style.position = 'fixed';
        this.modal.style.top = '50%';
        this.modal.style.left = '50%';
        this.modal.style.transform = 'translate(-50%, -50%)';
        this.modal.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        this.modal.style.padding = '24px';
        this.modal.style.borderRadius = '16px';
        this.modal.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        this.modal.style.zIndex = '1000';
        this.modal.style.textAlign = 'center';
        this.modal.style.minWidth = '440px';
        this.modal.style.border = '1px solid rgba(0, 0, 0, 0.1)';

        const title = document.createElement('h3');
        title.textContent = '🎮 FCV Snake Game';
        title.style.fontSize = '24px';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '16px';
        title.style.background = 'linear-gradient(90deg, #2563EB, #3B82F6)';
        title.style.webkitBackgroundClip = 'text';
        title.style.backgroundClip = 'text';
        title.style.color = 'transparent';

        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'snake-score';
        scoreDisplay.textContent = 'Score: 0';
        scoreDisplay.style.fontSize = '18px';
        scoreDisplay.style.fontWeight = '500';
        scoreDisplay.style.color = '#4B5563';
        scoreDisplay.style.marginBottom = '16px';

        const congratsMessage = document.createElement('div');
        congratsMessage.innerHTML = '🎉 You found the secret game!<br>Use arrow keys to control the snake.';
        congratsMessage.style.color = '#6B7280';
        congratsMessage.style.marginBottom = '20px';
        congratsMessage.style.fontSize = '16px';
        congratsMessage.style.lineHeight = '1.5';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '12px';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.marginBottom = '20px';

        const startButton = document.createElement('button');
        startButton.textContent = '▶️ Start Game';
        startButton.style.padding = '8px 20px';
        startButton.style.backgroundColor = '#10B981';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '8px';
        startButton.style.cursor = 'pointer';
        startButton.style.fontWeight = '500';
        startButton.style.transition = 'all 0.2s';
        startButton.onmouseover = () => startButton.style.transform = 'translateY(-2px)';
        startButton.onmouseout = () => startButton.style.transform = 'translateY(0)';
        startButton.onclick = () => this.startGameplay();

        const closeButton = document.createElement('button');
        closeButton.textContent = '✕ Close';
        closeButton.style.padding = '8px 20px';
        closeButton.style.backgroundColor = '#6B7280';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '8px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontWeight = '500';
        closeButton.style.transition = 'all 0.2s';
        closeButton.onmouseover = () => closeButton.style.transform = 'translateY(-2px)';
        closeButton.onmouseout = () => closeButton.style.transform = 'translateY(0)';
        closeButton.onclick = () => this.close();

        buttonContainer.appendChild(startButton);
        buttonContainer.appendChild(closeButton);

        this.modal.appendChild(title);
        this.modal.appendChild(scoreDisplay);
        this.modal.appendChild(congratsMessage);
        this.modal.appendChild(buttonContainer);
        this.modal.appendChild(this.canvas);
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.direction = 'up';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.direction = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.direction = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.direction = 'right';
                    break;
            }
        });
    }

    generateFood() {
        return {
            x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
            y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
        };
    }

    update() {
        if (!this.gameStarted) return;

        const head = { ...this.snake[0] };

        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('snake-score').textContent = `Score: ${this.score}`;
            this.food = this.generateFood();
            if (this.gameSpeed > 50) {
                this.gameSpeed -= 2;
                this.restartGameLoop();
            }
        } else {
            this.snake.pop();
        }
    }

    draw() {
        this.ctx.fillStyle = '#F9FAFB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.canvas.width; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }

        if (!this.gameStarted) {
            this.ctx.fillStyle = '#3B82F6';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press Start to begin!', this.canvas.width / 2, this.canvas.height / 2);
            return;
        }

        // Draw snake with gradient and outline
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? this.colors.snake.head : this.colors.snake.body;
            this.ctx.strokeStyle = this.colors.snake.outline;
            this.ctx.lineWidth = 1;

            const x = segment.x * this.gridSize;
            const y = segment.y * this.gridSize;
            const size = this.gridSize - 1;

            this.ctx.beginPath();
            this.ctx.roundRect(x, y, size, size, 4);
            this.ctx.fill();
            this.ctx.stroke();
        });

        // Draw food with glow effect
        this.ctx.fillStyle = this.colors.food.fill;
        this.ctx.strokeStyle = this.colors.food.outline;
        this.ctx.lineWidth = 1;

        const foodX = this.food.x * this.gridSize;
        const foodY = this.food.y * this.gridSize;
        const foodSize = this.gridSize - 1;

        this.ctx.shadowColor = this.colors.food.fill;
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.roundRect(foodX, foodY, foodSize, foodSize, 4);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    restartGameLoop() {
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, this.gameSpeed);
    }

    startGame() {
        document.body.appendChild(this.modal);
        this.draw(); // Draw initial instructions
    }

    startGameplay() {
        this.gameStarted = true;
        this.snake = [{ x: 10, y: 10 }];
        this.direction = 'right';
        this.score = 0;
        document.getElementById('snake-score').textContent = 'Score: 0';
        this.food = this.generateFood();
        this.gameSpeed = 100;
        this.restartGameLoop();
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 15);

        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 15);
        this.ctx.fillText('Press Start to play again', this.canvas.width / 2, this.canvas.height / 2 + 40);
    }

    close() {
        clearInterval(this.gameLoop);
        document.body.removeChild(this.modal);
    }
}