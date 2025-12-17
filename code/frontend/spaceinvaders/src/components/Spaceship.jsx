import playership from '../assets/player_ship.png';
import { useEffect, useState } from 'react';
import './Spaceship.css';

const arrowLeft = 'ArrowLeft';
const arrowRight = 'ArrowRight';
const moveSpeed = 2;

function Spaceship() {
    const [position, setPosition] = useState(50);

    const handleKeyDown = (e) => {
        if (e.key === arrowLeft) {
            setPosition((prev) => Math.max(5, prev - moveSpeed));
        } else if (e.key === arrowRight) {
            setPosition((prev) => Math.min(95, prev + moveSpeed));
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
