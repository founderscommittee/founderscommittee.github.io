class SnakeGame {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.canvas.style.border = '2px solid #007bff';
        this.canvas.style.borderRadius = '8px';
        
        this.gridSize = 20;
        this.snake = [{x: 10, y: 10}];
        this.food = this.generateFood();
        this.direction = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.gameSpeed = 100;
        this.gameStarted = false;

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
        this.modal.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        this.modal.style.padding = '20px';
        this.modal.style.borderRadius = '12px';
        this.modal.style.boxShadow = '0 0 20px rgba(0,0,0,0.2)';
        this.modal.style.zIndex = '1000';
        this.modal.style.textAlign = 'center';

        const title = document.createElement('h3');
        title.textContent = 'FCV Snake Game';
        title.style.marginBottom = '10px';
        title.style.color = '#007bff';

        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'snake-score';
        scoreDisplay.textContent = 'Score: 0';
        scoreDisplay.style.marginBottom = '10px';

        const congratsMessage = document.createElement('div');
        congratsMessage.textContent = '🎉 You found the secret game! Press Start to play.';
        congratsMessage.style.color = '#007bff';
        congratsMessage.style.marginBottom = '10px';
        congratsMessage.style.fontSize = '16px';

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.style.marginRight = '10px';
        startButton.style.padding = '8px 16px';
        startButton.style.backgroundColor = '#28a745';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '4px';
        startButton.style.cursor = 'pointer';
        startButton.onclick = () => this.startGameplay();

        this.modal.appendChild(title);
        this.modal.appendChild(scoreDisplay);
        this.modal.appendChild(congratsMessage);
        this.modal.appendChild(startButton);
        this.modal.appendChild(this.canvas);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '8px 16px';
        closeButton.style.backgroundColor = '#007bff';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => this.close();

        this.modal.appendChild(closeButton);
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
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

        const head = {...this.snake[0]};

        switch(this.direction) {
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
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.gameStarted) {
            this.ctx.fillStyle = '#007bff';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Use arrow keys to control the snake', this.canvas.width/2, this.canvas.height/2);
            return;
        }

        // Draw snake
        this.ctx.fillStyle = '#007bff';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // Draw food
        this.ctx.fillStyle = '#dc3545';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );
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
        this.snake = [{x: 10, y: 10}];
        this.direction = 'right';
        this.score = 0;
        document.getElementById('snake-score').textContent = 'Score: 0';
        this.food = this.generateFood();
        this.gameSpeed = 100;
        this.restartGameLoop();
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width/2, this.canvas.height/2);
    }

    close() {
        clearInterval(this.gameLoop);
        document.body.removeChild(this.modal);
    }
}