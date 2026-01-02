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

const SCORE_PER_TYPE_MAP = { 1: 200, 2: 100, 3: 50 };

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

    const handleStart = () => setGameState(GAME_STATE.PLAYING);

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
        setAliensPositions([]);
        setGameKey((prev) => prev + 1);
        setGameState(GAME_STATE.PLAYING);
        setScore(0);
    };

    useEffect(() => {
        if (!isPlaying) return;

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
    }, [isPlaying, shipX]);

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
                setScore((prev) => prev + SCORE_PER_TYPE_MAP[alien.type]);
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
                    onAliensChange={handleAliensPositionChange}
                />

                <Spaceship onPositionChange={setShipX} />

                {shots.map((s) => (
                    <Projectile
                        key={s.id}
                        startX={s.xPercent}
                        startY={s.yPercent}
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
