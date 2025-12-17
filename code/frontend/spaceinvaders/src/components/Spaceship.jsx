import playership from '../assets/player_ship.png';
import { useEffect, useState } from 'react';
import './Spaceship.css';

function Spaceship() {
    const [position, setPosition] = useState(50);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const moveSpeed = 2;

            if (e.key === 'ArrowLeft') {
                setPosition((prev) => Math.max(5, prev - moveSpeed));
            } else if (e.key === 'ArrowRight') {
                setPosition((prev) => Math.min(95, prev + moveSpeed));
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div
            style={{
                position: 'absolute',
                left: `${position}%`,
                bottom: '5%',
                transform: 'translateX(-50%)',
            }}
        >
            <img src={playership} alt="spaceship" id="spaceship-size" />
        </div>
    );
}

export default Spaceship;
