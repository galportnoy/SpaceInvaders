import { useEffect, useState, useRef } from 'react';
import './Projectile.css';

const SHOT_SPEED = 2;
const PROJECTILE_INTERVAL_MS = 30;

function Projectile({
    startX,
    startY,
    onMove,
    onDone,
    paused = false,
    powerType = 'DEFAULT',
}) {
    const [pos, setPos] = useState({
        xPercent: startX,
        yPercent: startY,
    });

    const onMoveRef = useRef(onMove);
    const onDoneRef = useRef(onDone);

    const pausedRef = useRef(paused);

    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    useEffect(() => {
        onMoveRef.current = onMove;
        onDoneRef.current = onDone;
    }, [onMove, onDone]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (pausedRef.current) return;

            setPos((prev) => {
                const nextY = prev.yPercent - SHOT_SPEED;

                if (nextY < 0) {
                    clearInterval(interval);
                    onDoneRef.current?.();
                    return prev;
                }

                const next = {
                    xPercent: prev.xPercent,
                    yPercent: nextY,
                };

                onMoveRef.current?.(next);
                return next;
            });
        }, PROJECTILE_INTERVAL_MS);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`projectile ${powerType === 'MEGA' ? 'projectile-mega' : ''}`}
            style={{
                left: `${pos.xPercent}%`,
                top: `${pos.yPercent}%`,
            }}
        />
    );
}

export default Projectile;
