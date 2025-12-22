import React, { useEffect, useState } from 'react';
import './Board.css';
import Spaceship from '../components/Spaceship.jsx';
import Projectile from './Projectile.jsx';
import Alien from '../components/Alien.jsx';

const SHIP_Y = 90;
const HIT_X = 2;
const HIT_Y = 2;

function Board() {
    const [started, setStarted] = useState(false);

    const [shipX, setShipX] = useState(50);
    const [shot, setShot] = useState(null);
    const [alienAlive, setAlienAlive] = useState(true);
    const [alienPos, setAlienPos] = useState({ xPercent: 50, yPercent: 5 });
    const handleStart = () => setStarted(true);

    useEffect(() => {
        if (!started) return;

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
    }, [started, shipX, shot]);

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
            {!started && (
                <button className="start-button" onClick={handleStart}>
                    start
                </button>
            )}
            {started && (
                <>
                    <Alien alive={alienAlive} onPositionChange={setAlienPos} />
                    <Spaceship onPositionChange={setShipX} />
                    {shot !== null && (
                        <Projectile
                            startX={shot.xPercent}
                            startY={shot.yPercent}
                            onMove={handleShotMove}
                            onDone={() => setShot(null)}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default Board;
