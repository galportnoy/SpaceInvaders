import { useState } from 'react';
import './GameOver.css';

function GameOver({ score, onPlayAgain }) {
    const [name, setName] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveScore = async () => {
        if (!name.trim()) return;

        setIsSaving(true);
        try {
            await fetch('/api/save-score/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), score }),
            });
            setIsSaved(true);
        } catch (error) {
            console.error('Failed to save score:', error);
        }
        setIsSaving(false);
    };

    return (
        <div className="game-over-overlay">
            <div className="game-over-content">
                <h1 className="game-over-title">Game Over</h1>
                <p>Your Score Is: {score}</p>

                {!isSaved ? (
                    <div className="save-score-section">
                        <input
                            type="text"
                            className="name-input"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button
                            className="save-score-button"
                            onClick={handleSaveScore}
                            disabled={!name.trim() || isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Score'}
                        </button>
                    </div>
                ) : (
                    <p className="saved-message">Score saved!</p>
                )}

                <button className="play-again-button" onClick={onPlayAgain}>
                    Play Again
                </button>
            </div>
        </div>
    );
}

export default GameOver;
