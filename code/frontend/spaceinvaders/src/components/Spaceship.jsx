import playership from '../assets/player_ship.png';
import { useEffect, useState } from 'react';
import './Spaceship.css';

const LEFT_ARROW = 'ArrowLeft';
const RIGHT_ARROW = 'ArrowRight';
const MOVE_SPEED = 2;

function Spaceship() {
    const [position, setPosition] = useState(50);

    const handleKeyDown = (e) => {
        if (e.key === LEFT_ARROW) {
            setPosition((prev) => Math.max(5, prev - MOVE_SPEED));
        } else if (e.key === RIGHT_ARROW) {
            setPosition((prev) => Math.min(95, prev + MOVE_SPEED));
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

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
