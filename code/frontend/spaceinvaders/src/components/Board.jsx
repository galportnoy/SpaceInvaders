import React, { useEffect, useState, useRef } from 'react';
import './Board.css';
import Spaceship from '../components/Spaceship.jsx';
import Projectile from './Projectile.jsx';
import AlienFormation from '../components/AlienFormation.jsx';
import GameOver from './GameOver.jsx';
import ScoreBar from './ScoreBar.jsx';
import Quiz from './Quiz.jsx';
import { ALIEN_TYPES } from '../constants/alienTypes.js';

const SHIP_Y = 90;
const HIT_X = 2;
const HIT_Y = 2;

const GAME_STATE = {
    IDLE: 'idle',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
};

const SCORE_PER_TYPE_MAP = {
    [ALIEN_TYPES.FIRST]: 200,
    [ALIEN_TYPES.SECOND]: 100,
    [ALIEN_TYPES.THIRD]: 50,
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
    const [showQuiz, setShowQuiz] = useState(false);
    const PAUSE_KEY_CODE = 'KeyP';
    const MEGA_KEY = 'KeyZ';
    const SPACE = 'Space';
    const DEFAULT_SHOT = 'DEFAULT';

    const SHOT_TYPES = {
        MEGA: 'MEGA',
    };

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
        setShowQuiz(false);
        setAliensPositions([]);
        setGameKey((prev) => prev + 1);
        setGameState(GAME_STATE.PLAYING);
        setScore(0);
        setMegaUsed(false);
    };
    const togglePause = () => {
        setPaused((prev) => !prev);
    };

    const handleWaveComplete = () => {
        setPaused(true);
        setShowQuiz(true);
    };

    const handleQuizComplete = () => {
        setShowQuiz(false);
        setPaused(false);
    };

    useEffect(() => {
        const onKeyDown = (e) => {
            if (!isPlaying) return;
            if (e.repeat) return;
            if (e.code !== PAUSE_KEY_CODE) return;
            togglePause();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isPlaying]);

    const shotHitHandlers = {
        DEFAULT: ({ alien }) => {
            formationRef.current?.killAlien(alien.id);
            setScore((prev) => prev + SCORE_PER_TYPE_MAP[alien.type]);
            return { removeShot: true };
        },

        [SHOT_TYPES.MEGA]: ({ alien }) => {
            formationRef.current?.killAlien(alien.id);
            setScore((prev) => prev + SCORE_PER_TYPE_MAP[alien.type]);
            return { removeShot: false };
        },
    };

    const applyShotOnHit = ({ shot, alien }) => {
        const type = shot.powerType || DEFAULT_SHOT;
        const handler = shotHitHandlers[type] || shotHitHandlers[DEFAULT_SHOT];
        return handler({ shot, alien });
    };

    useEffect(() => {
        if (!isPlaying) return;
        if (paused) return;

        const onKeyDown = (e) => {
            if (e.repeat) return;
            const isSpace = e.code === SPACE;
            const isMega = e.code === MEGA_KEY;

            if (!isSpace && !isMega) return;
            e.preventDefault();

            if (isMega) {
                if (megaUsed) return;
                setMegaUsed(true);
            }

            const newShot = {
                id: shotIdRef.current++,
                xPercent: shipX,
                yPercent: SHIP_Y,
            };

            if (isMega) {
                newShot.powerType = SHOT_TYPES.MEGA;
            }

            setShots((prev) => [...prev, newShot]);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isPlaying, paused, shipX, megaUsed, SHOT_TYPES.MEGA]);

    const handleShotMove = (shotId, nextPos) => {
        setShots((prevShots) => {
            const currentShot = prevShots.find((s) => s.id === shotId);
            if (!currentShot) return prevShots;

            let nextShots = prevShots.map((shot) => {
                if (shot.id === shotId) {
                    return {
                        ...shot,
                        xPercent: nextPos.xPercent,
                        yPercent: nextPos.yPercent,
                    };
                }
                return shot;
            });

            for (const alien of aliensPositions) {
                const dx = Math.abs(nextPos.xPercent - alien.xPercent);
                const dy = Math.abs(nextPos.yPercent - alien.yPercent);

                if (dx <= HIT_X && dy <= HIT_Y) {
                    const { removeShot } = applyShotOnHit({
                        shot: currentShot,
                        alien,
                    });

                    if (removeShot) {
                        nextShots = nextShots.filter((s) => s.id !== shotId);
                    }
                    break;
                }
            }
            return nextShots;
        });
    };

    const handleProjectileDone = (shotId) => {
        setShots((prev) => prev.filter((s) => s.id !== shotId));
    };
    const handleRoundStart = () => {
        setMegaUsed(false);
        setShots([]);
    };

    const renderGame = () => {
        return (
            <div key={gameKey} className="game-content">
                <AlienFormation
                    ref={formationRef}
                    gameOver={isGameOver}
                    paused={paused || showQuiz}
                    onAliensChange={handleAliensPositionChange}
                    onWaveComplete={handleWaveComplete}
                />
                <Spaceship
                    onPositionChange={setShipX}
                    paused={paused || showQuiz}
                />
                {shots.map((s) => (
                    <Projectile
                        key={s.id}
                        startX={s.xPercent}
                        startY={s.yPercent}
                        paused={paused || showQuiz}
                        onMove={(nextPos) => handleShotMove(s.id, nextPos)}
                        onDone={() => handleProjectileDone(s.id)}
                    />
                ))}

                {isGameOver && (
                    <GameOver score={score} onPlayAgain={handlePlayAgain} />
                )}

                {showQuiz && <Quiz onComplete={handleQuizComplete} />}
            </div>
        );
    };

    return (
        <div className="game-wrapper">
            <div className="hud">
                <ScoreBar score={score} />

                {isPlaying && !isGameOver && (
                    <button className="pause-button" onClick={togglePause}>
                        {paused ? 'Resume' : 'Pause'}
                    </button>
                )}
            </div>

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
