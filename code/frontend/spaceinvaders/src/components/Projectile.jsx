import { useEffect, useState } from 'react';
import './Projectile.css';

const SHOT_SPEED = 2;

function Projectile({ startX, startY, onMove, onDone }) {
    const [pos, setPos] = useState({
        xPercent: startX,
        yPercent: startY,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setPos((prev) => {
                const nextY = prev.yPercent - SHOT_SPEED;

                if (nextY < 0) {
                    clearInterval(interval);

                    if (onDone) {
                        onDone();
                    }

                    return prev;
                }

                const next = {
                    xPercent: prev.xPercent,
                    yPercent: nextY,
                };

                if (onMove) {
                    onMove(next);
                }

                return next;
            });
        }, 30);

        return () => clearInterval(interval);
    });

    return (
        <div
            className="projectile"
            style={{
                left: `${pos.xPercent}%`,
                top: `${pos.yPercent}%`,
            }}
        />
    );
}

export default Projectile;
