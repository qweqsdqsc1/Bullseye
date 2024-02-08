class Movement {
    constructor(player) {
        this.player = player;
        this.registerEvents();
    }

    registerEvents() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        switch(event.key) {
            case 'ArrowUp':
            case 'w':
                this.player.moveUp();
                break;
            case 'ArrowDown':
            case 's':
                this.player.moveDown();
                break;
            case 'ArrowLeft':
            case 'a':
                this.player.moveLeft();
                break;
            case 'ArrowRight':
            case 'd':
                this.player.moveRight();
                break;
            default:
                break;
        }
    }

    handleKeyUp(event) {
        // Handle key release if needed
    }
}

export default Movement;
