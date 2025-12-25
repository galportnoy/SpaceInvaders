import alienImg from '../assets/space_squid.png';
import { useEffect, useRef, useState } from 'react';
import './Alien.css';

const MOVE_SPEED = 2;
const STEP_DOWN = 5;
const RIGHT_BORDER = 95;
const LEFT_BORDER = 5;
const SPACESHIP_LINE = 90;
const MOVEMENT_INTERVAL_MS = 100;

function Alien({ onPositionChange, alive = true, gameOver = false }) {
    const [horizontalPosition, setHorizontalPosition] = useState(50);
    const [verticalPosition, setVerticalPosition] = useState(5);

    const isDirectionRight = useRef(true);
    const gameOverRef = useRef(gameOver);

    useEffect(() => {
        gameOverRef.current = gameOver;
    }, [gameOver]);

    const dynamicStyle = {
        '--alien-position-x': `${horizontalPosition}%`,
        '--alien-position-y': `${verticalPosition}%`,
    };

    const moveHorizontally = (newXPosition) => {
        if (isDirectionRight.current) {
            newXPosition += MOVE_SPEED;
        } else {
            newXPosition -= MOVE_SPEED;
        }
        return newXPosition;
    };

    const changeDirection = () => {
        isDirectionRight.current = !isDirectionRight.current;
    };

    const stepDown = (interval) => {
        setVerticalPosition((prevYPosition) => {
            const newYposition = prevYPosition + STEP_DOWN;
            if (newYposition >= SPACESHIP_LINE) {
                clearInterval(interval);
            }
            return newYposition;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (gameOverRef.current) {
                clearInterval(interval);
                return;
            }
            setHorizontalPosition((prevXPosition) => {
                const newXPosition = moveHorizontally(prevXPosition);
                const hitBorder =
                    newXPosition <= LEFT_BORDER || newXPosition >= RIGHT_BORDER;

                if (hitBorder) {
                    changeDirection();
                    stepDown(interval);
                    return prevXPosition;
                }
                return newXPosition;
            });
        }, MOVEMENT_INTERVAL_MS);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (onPositionChange) {
            onPositionChange({
                xPercent: horizontalPosition,
                yPercent: verticalPosition,
            });
        }
    }, [horizontalPosition, verticalPosition, onPositionChange]);

    if (!alive) return null;

    return (
        <div className="alien-container" style={dynamicStyle}>
            <img src={alienImg} alt="alien" />
        </div>
    );
}
export default Alien;
