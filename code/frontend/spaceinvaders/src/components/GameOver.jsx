import './GameOver.css';

function GameOver({ onPlayAgain }) {
    return (
        <div className="game-over-overlay">
            <div className="game-over-content">
                <h1 className="game-over-title">Game Over</h1>
                <button className="play-again-button" onClick={onPlayAgain}>
                    Play Again
                </button>
            </div>
        </div>
    );
}

export default GameOver;
