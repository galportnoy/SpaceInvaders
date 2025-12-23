import playership from '../assets/player_ship.png';
import { useEffect, useState, useRef } from 'react';
import './Spaceship.css';

const LEFT_ARROW = 'ArrowLeft';
const RIGHT_ARROW = 'ArrowRight';
const MOVE_SPEED = 1;

function Spaceship({ onPositionChange }) {
    const [position, setPosition] = useState(50);
    const keysPressed = useRef(new Set());

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
            setPosition((prev) => {
                let next = prev;
                if (keysPressed.current.has(LEFT_ARROW)) {
                    next = Math.max(5, next - MOVE_SPEED);
                }
                if (keysPressed.current.has(RIGHT_ARROW)) {
                    next = Math.min(95, next + MOVE_SPEED);
                }
                return next;
            });
        }, 16);

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
