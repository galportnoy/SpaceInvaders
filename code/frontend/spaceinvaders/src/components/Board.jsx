import React, { useEffect, useState } from 'react';
import './Board.css';
import Spaceship from '../components/Spaceship.jsx';
import Projectile from './Projectile.jsx';
import Alien from '../components/Alien.jsx';
import GameOver from './GameOver.jsx';
import ScoreBar from './ScoreBar.jsx';

const SHIP_Y = 90;
const HIT_X = 2;
const HIT_Y = 2;

const GAME_STATE = {
    IDLE: 'idle',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
};

function Board() {
    const [gameState, setGameState] = useState(GAME_STATE.IDLE);
    const [gameKey, setGameKey] = useState(0);

    const [shipX, setShipX] = useState(50);
    const [shot, setShot] = useState(null);
    const [alienAlive, setAlienAlive] = useState(true);
    const [alienPos, setAlienPos] = useState({ xPercent: 50, yPercent: 5 });
    const [score, setScore] = useState(0);

    const isPlaying = gameState === GAME_STATE.PLAYING;
    const isGameOver = gameState === GAME_STATE.GAME_OVER;
    const isIdle = gameState === GAME_STATE.IDLE;

    const handleStart = () => setGameState(GAME_STATE.PLAYING);

    const handleAlienPositionChange = (pos) => {
        if (gameState !== GAME_STATE.PLAYING) return;
        setAlienPos(pos);
        if (pos.yPercent >= SHIP_Y) {
            setGameState(GAME_STATE.GAME_OVER);
        }
    };

    const handlePlayAgain = () => {
        setShipX(50);
        setShot(null);
        setAlienAlive(true);
        setAlienPos({ xPercent: 50, yPercent: 5 });
        setGameKey((prev) => prev + 1);
        setGameState(GAME_STATE.PLAYING);
        setScore(0);
    };

    useEffect(() => {
        if (!isPlaying) return;

        const onKeyDown = (e) => {
            if (e.key !== ' ') return;
            e.preventDefault();

            if (shot != null) return;

            setShot({
                xPercent: shipX,
                yPercent: SHIP_Y,
            });
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isPlaying, shipX, shot]);

    const handleShotMove = (nextPos) => {
        if (!alienAlive) {
            setShot(nextPos);
            return;
        }

        const dx = Math.abs(nextPos.xPercent - alienPos.xPercent);
        const dy = Math.abs(nextPos.yPercent - alienPos.yPercent);

        if (dx <= HIT_X && dy <= HIT_Y) {
            setAlienAlive(false);
            setShot(null);
            setScore((prev) => prev + 100);
            return;
        }

        setShot(nextPos);
    };

    return (
        <div className="game-wrapper">
            <ScoreBar score={score} />
            <div className="board">
                {isIdle && (
                    <button className="start-button" onClick={handleStart}>
                        start
                    </button>
                )}
                {!isIdle && (
                    <div key={gameKey} className="game-content">
                        <Alien
                            alive={alienAlive}
                            gameOver={isGameOver}
                            onPositionChange={handleAlienPositionChange}
                        />
                        <Spaceship onPositionChange={setShipX} />
                        {shot !== null && (
                            <Projectile
                                startX={shot.xPercent}
                                startY={shot.yPercent}
                                onMove={handleShotMove}
                                onDone={() => setShot(null)}
                            />
                        )}
                        {isGameOver && (
                            <GameOver
                                score={score}
                                onPlayAgain={handlePlayAgain}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Board;
