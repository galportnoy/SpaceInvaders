import React, { useEffect, useState } from 'react';
import './Board.css';
import Spaceship from '../components/Spaceship.jsx';
import Projectile from './Projectile.jsx';
import Alien from '../components/Alien.jsx';
import GameOver from './GameOver.jsx';

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
            return;
        }

        setShot(nextPos);
    };

    return (
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
                    {isGameOver && <GameOver onPlayAgain={handlePlayAgain} />}
                </div>
            )}
        </div>
    );
}

export default Board;
