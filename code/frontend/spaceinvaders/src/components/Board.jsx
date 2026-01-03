import React, { useEffect, useState, useRef } from 'react';
import './Board.css';
import Spaceship from '../components/Spaceship.jsx';
import Projectile from './Projectile.jsx';
import AlienFormation from '../components/AlienFormation.jsx';
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
    const [shots, setShots] = useState([]);
    const [aliensPositions, setAliensPositions] = useState([]);
    const [score, setScore] = useState(0);
    const shotIdRef = useRef(0);
    const formationRef = useRef(null);

    const isPlaying = gameState === GAME_STATE.PLAYING;
    const isGameOver = gameState === GAME_STATE.GAME_OVER;
    const isIdle = gameState === GAME_STATE.IDLE;
    const [paused, setPaused] = useState(false);
    const PAUSE_KEY_CODE = 'KeyP';

    const handleStart = () => {
        setPaused(false);
        setGameState(GAME_STATE.PLAYING);
    };
    const handleAliensPositionChange = (positions) => {
        if (gameState !== GAME_STATE.PLAYING) return;
        setAliensPositions(positions);
        if (positions?.some((alien) => alien.yPercent >= SHIP_Y - 5)) {
            setGameState(GAME_STATE.GAME_OVER);
        }
    };

    const handlePlayAgain = () => {
        setShipX(50);
        setShots([]);
        setPaused(false);
        setAliensPositions([]);
        setGameKey((prev) => prev + 1);
        setGameState(GAME_STATE.PLAYING);
        setScore(0);
    };
    const togglePause = () => {
        setPaused((prev) => !prev);
    };

    useEffect(() => {
        const onKeyDown = (e) => {
            if (!isPlaying) return;
            if (e.code !== PAUSE_KEY_CODE) return;
            togglePause();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isPlaying]);

    useEffect(() => {
        if (!isPlaying) return;
        if (paused) return;

        const onKeyDown = (e) => {
            e.preventDefault();
            if (e.key !== ' ') return;
            if (e.repeat) return;

            const newShot = {
                id: shotIdRef.current++,
                xPercent: shipX,
                yPercent: SHIP_Y,
            };

            setShots((prev) => [...prev, newShot]);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isPlaying, paused, shipX]);

    const handleShotMove = (shotId, nextPos) => {
        setShots((prevShots) => {
            return prevShots.map((shot) => {
                if (shot.id === shotId) {
                    return {
                        ...shot,
                        xPercent: nextPos.xPercent,
                        yPercent: nextPos.yPercent,
                    };
                }
                return shot;
            });
        });

        for (const alien of aliensPositions) {
            const dx = Math.abs(nextPos.xPercent - alien.xPercent);
            const dy = Math.abs(nextPos.yPercent - alien.yPercent);

            if (dx <= HIT_X && dy <= HIT_Y) {
                formationRef.current?.killAlien(alien.id);
                setShots((prev) => prev.filter((s) => s.id !== shotId));
                setScore((prev) => prev + 100);
                break;
            }
        }
    };

    const handleProjectileDone = (shotId) => {
        setShots((prev) => prev.filter((s) => s.id !== shotId));
    };

    const renderGame = () => {
        return (
            <div key={gameKey} className="game-content">
                <AlienFormation
                    ref={formationRef}
                    gameOver={isGameOver}
                    paused={paused}
                    onAliensChange={handleAliensPositionChange}
                />
                <Spaceship onPositionChange={setShipX} paused={paused} />
                {shots.map((s) => (
                    <Projectile
                        key={s.id}
                        startX={s.xPercent}
                        startY={s.yPercent}
                        paused={paused}
                        onMove={(nextPos) => handleShotMove(s.id, nextPos)}
                        onDone={() => handleProjectileDone(s.id)}
                    />
                ))}

                {isGameOver && (
                    <GameOver score={score} onPlayAgain={handlePlayAgain} />
                )}
            </div>
        );
    };

    return (
        <div className="game-wrapper">
            <ScoreBar score={score} />

            {isPlaying && !isGameOver && (
                <button onClick={togglePause}>
                    {paused ? 'Resume' : 'Pause'}
                </button>
            )}

            <div className="board">
                {isIdle && (
                    <button className="start-button" onClick={handleStart}>
                        start
                    </button>
                )}

                {!isIdle && renderGame()}
            </div>
        </div>
    );
}

export default Board;
