import React, { useEffect, useState } from 'react';
import './Board.css';
import Spaceship from '../components/Spaceship.jsx';
import Projectile from './Projectile.jsx';
import Alien from '../components/Alien.jsx';

const SHIP_Y = 580;
const SHOT_SPEED = 20;

function Board() {
    const [started, setStarted] = useState(false);

    const [shipX, setShipX] = useState(50);
    const [shot, setShot] = useState(null);

    const handleStart = () => setStarted(true);

    useEffect(() => {
        if (!started) return;

        const onKeyDown = (e) => {
            if (e.key !== ' ') return;
            e.preventDefault();

            if (shot != null) return;

            setShot({
                xPercent: shipX,
                yPx: SHIP_Y,
            });
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [started, shipX, shot]);

    useEffect(() => {
        if (!started || shot == null) return;

        const timeout = setTimeout(() => {
            setShot((prev) => {
                if (!prev) return null;

                const nextY = prev.yPx - SHOT_SPEED;
                if (nextY < 0) return null;

                return { ...prev, yPx: nextY };
            });
        }, 30);

        return () => clearTimeout(timeout);
    }, [started, shot]);

    return (
        <div className="board">
            {!started && (
                <button className="start-button" onClick={handleStart}>
                    start
                </button>
            )}
            {started && (
                <>
                    <Alien/>
                    <Spaceship onPositionChange={setShipX} />
                    {shot !== null && (
                        <Projectile xPercent={shot.xPercent} yPx={shot.yPx} />
                    )}
                </>
            )}
        </div>
    );
}

export default Board;
