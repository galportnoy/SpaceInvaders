import './GameStartInstructions.css';
import playerShip from '../assets/player_ship.png';
import sillyAlien from '../assets/silly_alien.png';
import spaceSquid from '../assets/space_squid.png';
import basicAlien from '../assets/basic_alien.png';

const POWER_UPS = [
    {
        emoji: '🔫',
        name: 'Machine Gun',
        description: 'Press [M] then hold [SPACE] for rapid fire!',
        duration: '5 seconds',
    },
    {
        emoji: '💥',
        name: 'Mega Shot',
        description:
            'Press [Z] for a powerful shot that pierces through aliens!',
        duration: 'Single use',
    },
    {
        emoji: '🐢',
        name: 'Slow Down',
        description: 'Activates automatically! Slows all aliens.',
        duration: '10 seconds',
    },
];

const ALIENS = [
    { image: sillyAlien, name: 'Silly Alien', points: 200 },
    { image: spaceSquid, name: 'Space Squid', points: 100 },
    { image: basicAlien, name: 'Basic Alien', points: 50 },
];

function GameInstructions({ onStart }) {
    return (
        <div className="instructions-container">
            <div className="start-section">
                <h1 className="game-title">
                    <img
                        src={playerShip}
                        alt="Spaceship"
                        className="title-ship"
                    />
                    SPACE INVADERS
                    <img
                        src={playerShip}
                        alt="Spaceship"
                        className="title-ship"
                    />
                </h1>
                <button className="start-button-new" onClick={onStart}>
                    🎮 START PLAYING
                </button>
                <div className="scoring-box-left">
                    <span className="scoring-label">🎯 Scoring</span>
                    <div className="alien-scores-left">
                        {ALIENS.map((alien, index) => (
                            <div key={index} className="alien-score-item-left">
                                <img
                                    src={alien.image}
                                    alt={alien.name}
                                    className="alien-score-img-left"
                                />
                                <span className="alien-points-left">
                                    {alien.points}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="instructions-section">
                <div className="welcome-box">
                    <h2>🚀 How to Play</h2>
                    <p>
                        Defend Earth from the alien invasion! Achieve the{' '}
                        <strong>highest score</strong> by shooting down waves of
                        aliens.
                    </p>
                    <div className="controls-wrapper">
                        <span className="controls-label">Controls:</span>
                        <div className="controls-hint">
                            <span>← → to Move</span>
                            <span>SPACE to Shoot</span>
                            <span>P to Pause</span>
                        </div>
                    </div>
                    <p className="warning">
                        ⚠️ Every time you clear a wave, the next one is faster!
                    </p>
                </div>

                <div className="trivia-box">
                    <h3>📋 Trivia System</h3>
                    <p>
                        After each wave, answer a trivia question correctly to
                        receive a
                        <span className="highlight"> random power-up!</span>
                    </p>
                </div>

                <div className="powerups-section">
                    <h3>⚡ Power-Ups</h3>
                    <div className="powerup-cards">
                        {POWER_UPS.map((powerUp, index) => (
                            <div key={index} className="powerup-card">
                                <span className="powerup-emoji">
                                    {powerUp.emoji}
                                </span>
                                <span className="powerup-name">
                                    {powerUp.name}
                                </span>
                                <span className="powerup-desc">
                                    {powerUp.description}
                                </span>
                                <span className="powerup-duration">
                                    {powerUp.duration}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameInstructions;
