import playership from '../assets/player_ship.png';
import { useEffect, useState, useRef } from 'react';
import './Spaceship.css';

const LEFT_ARROW = 'ArrowLeft';
const RIGHT_ARROW = 'ArrowRight';
const MOVE_SPEED = 1;
const MOVEMENT_INTERVAL_MS = 16;

function Spaceship({ onPositionChange, paused = false }) {
    const [position, setPosition] = useState(50);
    const keysPressed = useRef(new Set());

    const pausedRef = useRef(paused);

    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            keysPressed.current.add(e.key);
        };

        const handleKeyUp = (e) => {
            keysPressed.current.delete(e.key);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const interval = setInterval(() => {
            if (pausedRef.current) return;

            setPosition((prev) => {
                let delta = 0;
                if (keysPressed.current.has(LEFT_ARROW)) {
                    delta -= MOVE_SPEED;
                }
                if (keysPressed.current.has(RIGHT_ARROW)) {
                    delta += MOVE_SPEED;
                }
                return Math.max(5, Math.min(95, prev + delta));
            });
        }, MOVEMENT_INTERVAL_MS);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (onPositionChange) {
            onPositionChange(position);
        }
    }, [position, onPositionChange]);

    return (
        <div
            className="spaceship-container"
            style={{ '--spaceship-position': `${position}%` }}
        >
            <img src={playership} alt="spaceship" id="spaceship-size" />
        </div>
    );
}

export default Spaceship;
