import { useState } from 'react';
import './GameOver.css';

function GameOver({ score, onPlayAgain }) {
    const [name, setName] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);

    const handleSaveScore = async () => {
        if (!name.trim()) return;

        setIsSaving(true);
        try {
            await fetch('/api/save-score/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), score }),
            });
            const leaderboardRes = await fetch('/api/leaderboard/');
            const leaderboardData = await leaderboardRes.json();
            setLeaderboard(leaderboardData);
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
                    <div className="leaderboard-section">
                        <p className="saved-message">Score saved!</p>
                        {leaderboard.length > 0 && (
                            <>
                                <h2 className="leaderboard-title">
                                    Top 5 Leaders
                                </h2>
                                <ul className="leaderboard-list">
                                    {leaderboard.map((entry, index) => (
                                        <li
                                            key={index}
                                            className="leaderboard-item"
                                        >
                                            <span className="leaderboard-rank">
                                                {index + 1}.
                                            </span>
                                            <span className="leaderboard-name">
                                                {entry.name}
                                            </span>
                                            <span className="leaderboard-score">
                                                {entry.score}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}

                <button className="play-again-button" onClick={onPlayAgain}>
                    Play Again
                </button>
            </div>
        </div>
    );
}

export default GameOver;
