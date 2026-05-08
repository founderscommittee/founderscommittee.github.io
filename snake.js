let _snakeGameInstance = null;

class SnakeGame {
    constructor() {
        if (_snakeGameInstance) _snakeGameInstance.close();
        _snakeGameInstance = this;

        // Snap canvas size to grid multiple so cells are always whole pixels
        const rawSize = Math.min(400, window.innerWidth - 64);
        this.gridSize = 20;
        const size = Math.floor(rawSize / this.gridSize) * this.gridSize;
        this.cellCount = size / this.gridSize;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style.borderRadius = '6px';
        this.canvas.style.display = 'block';

        const mid = Math.floor(this.cellCount / 2);
        this.snake = [{ x: mid, y: mid }];
        this.food = this.generateFood();
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.gameSpeed = 100;
        this.gameStarted = false;
        this.touchStartX = 0;
        this.touchStartY = 0;

        // Bind for later removeEventListener
        this.handleKeyDown = this._onKeyDown.bind(this);
        this.handleTouchStart = this._onTouchStart.bind(this);
        this.handleTouchEnd = this._onTouchEnd.bind(this);

        this.modal = document.createElement('div');
        this.backdrop = document.createElement('div');
        this.setupModal();
        this.setupControls();
        this.startGame();
    }

    setupModal() {
        const modalWidth = Math.min(440, window.innerWidth * 0.92);
        const isMobile = window.innerWidth < 480;

        Object.assign(this.backdrop.style, {
            position: 'fixed', inset: '0',
            backgroundColor: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(4px)',
            zIndex: '9999',
        });
        this.backdrop.onclick = () => this.close();

        Object.assign(this.modal.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: isMobile ? '20px' : '24px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
            zIndex: '10000',
            textAlign: 'center',
            width: modalWidth + 'px',
            fontFamily: "'Inter', system-ui, sans-serif",
        });

        const title = document.createElement('div');
        title.textContent = 'FCV Snake';
        Object.assign(title.style, {
            fontSize: '18px', fontWeight: '900',
            letterSpacing: '-0.03em', color: '#ffffff',
            marginBottom: '4px',
        });

        this.scoreDisplay = document.createElement('div');
        this.scoreDisplay.textContent = 'Score: 0';
        Object.assign(this.scoreDisplay.style, {
            fontSize: '11px', fontWeight: '700',
            color: '#e85d04', marginBottom: '14px',
            letterSpacing: '0.1em', textTransform: 'uppercase',
        });

        const hint = document.createElement('div');
        hint.textContent = isMobile
            ? 'Swipe to steer · Tap close to exit'
            : 'Arrow keys to steer · Esc to close';
        Object.assign(hint.style, {
            fontSize: '11px', color: 'rgba(255,255,255,0.3)',
            marginBottom: '14px', letterSpacing: '0.04em',
        });

        const buttonRow = document.createElement('div');
        Object.assign(buttonRow.style, {
            display: 'flex', gap: '8px',
            justifyContent: 'center', marginBottom: '16px',
        });

        this.startBtn = document.createElement('button');
        this.startBtn.textContent = 'Start';
        Object.assign(this.startBtn.style, {
            padding: '8px 22px', backgroundColor: '#e85d04',
            color: '#fff', border: 'none', borderRadius: '4px',
            cursor: 'pointer', fontWeight: '700', fontSize: '12px',
            fontFamily: "'Inter', system-ui, sans-serif",
            letterSpacing: '0.06em', textTransform: 'uppercase',
        });
        this.startBtn.onclick = () => this.startGameplay();

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        Object.assign(closeBtn.style, {
            padding: '8px 22px', backgroundColor: 'transparent',
            color: 'rgba(255,255,255,0.45)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '4px', cursor: 'pointer',
            fontWeight: '600', fontSize: '12px',
            fontFamily: "'Inter', system-ui, sans-serif",
            letterSpacing: '0.06em', textTransform: 'uppercase',
        });
        closeBtn.onclick = () => this.close();

        buttonRow.appendChild(this.startBtn);
        buttonRow.appendChild(closeBtn);

        this.modal.appendChild(title);
        this.modal.appendChild(this.scoreDisplay);
        this.modal.appendChild(hint);
        this.modal.appendChild(buttonRow);
        this.modal.appendChild(this.canvas);
    }

    setupControls() {
        document.addEventListener('keydown', this.handleKeyDown);
        this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        this.canvas.addEventListener('touchend', this.handleTouchEnd, { passive: true });
    }

    _onKeyDown(e) {
        if (e.key === 'Escape') { this.close(); return; }
        if (!this.gameStarted) return;
        const map = {
            ArrowUp: 'up', ArrowDown: 'down',
            ArrowLeft: 'left', ArrowRight: 'right',
        };
        const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };
        const next = map[e.key];
        if (next && opposite[next] !== this.direction) {
            this.nextDirection = next;
            e.preventDefault();
        }
    }

    _onTouchStart(e) {
        this.touchStartX = e.changedTouches[0].clientX;
        this.touchStartY = e.changedTouches[0].clientY;
    }

    _onTouchEnd(e) {
        if (!this.gameStarted) return;
        const dx = e.changedTouches[0].clientX - this.touchStartX;
        const dy = e.changedTouches[0].clientY - this.touchStartY;
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };
        let next;
        if (Math.abs(dx) > Math.abs(dy)) {
            next = dx > 0 ? 'right' : 'left';
        } else {
            next = dy > 0 ? 'down' : 'up';
        }
        if (opposite[next] !== this.direction) this.nextDirection = next;
    }

    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.cellCount),
                y: Math.floor(Math.random() * this.cellCount),
            };
        } while (this.snake && this.snake.some(s => s.x === food.x && s.y === food.y));
        return food;
    }

    update() {
        if (!this.gameStarted) return;
        this.direction = this.nextDirection;

        const head = { ...this.snake[0] };
        if (this.direction === 'up') head.y--;
        else if (this.direction === 'down') head.y++;
        else if (this.direction === 'left') head.x--;
        else head.x++;

        if (head.x < 0 || head.x >= this.cellCount ||
            head.y < 0 || head.y >= this.cellCount ||
            this.snake.some(s => s.x === head.x && s.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreDisplay.textContent = 'Score: ' + this.score;
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
        const { ctx, canvas, gridSize } = this;

        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= canvas.width; i += gridSize) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        if (!this.gameStarted) {
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.font = `600 13px 'Inter', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('Press Start to begin', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Snake
        const r = Math.max(2, Math.floor(gridSize / 5));
        this.snake.forEach((seg, i) => {
            ctx.fillStyle = i === 0 ? '#e85d04' : 'rgba(232,93,4,0.5)';
            ctx.strokeStyle = i === 0 ? 'rgba(255,124,42,0.8)' : 'rgba(232,93,4,0.25)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2, r);
            ctx.fill();
            ctx.stroke();
        });

        // Food
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(255,255,255,0.5)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(this.food.x * gridSize + 2, this.food.y * gridSize + 2, gridSize - 4, gridSize - 4, r);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    restartGameLoop() {
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => { this.update(); this.draw(); }, this.gameSpeed);
    }

    startGame() {
        document.body.appendChild(this.backdrop);
        document.body.appendChild(this.modal);
        this.draw();
    }

    startGameplay() {
        const mid = Math.floor(this.cellCount / 2);
        this.snake = [{ x: mid, y: mid }];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.scoreDisplay.textContent = 'Score: 0';
        this.food = this.generateFood();
        this.gameSpeed = 100;
        this.gameStarted = true;
        this.startBtn.textContent = 'Restart';
        this.restartGameLoop();
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.gameStarted = false;
        this.startBtn.textContent = 'Play Again';

        const { ctx, canvas } = this;
        ctx.fillStyle = 'rgba(0,0,0,0.78)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = `900 20px 'Inter', system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 14);

        ctx.fillStyle = '#e85d04';
        ctx.font = `700 12px 'Inter', system-ui, sans-serif`;
        ctx.letterSpacing = '0.08em';
        ctx.fillText('SCORE: ' + this.score, canvas.width / 2, canvas.height / 2 + 12);
    }

    close() {
        clearInterval(this.gameLoop);
        document.removeEventListener('keydown', this.handleKeyDown);
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
        if (this.backdrop.parentNode) this.backdrop.parentNode.removeChild(this.backdrop);
        if (this.modal.parentNode) this.modal.parentNode.removeChild(this.modal);
        _snakeGameInstance = null;
    }
}
