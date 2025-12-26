import { useEffect, useRef, useState } from 'react';
import Alien from './Alien.jsx';

const ROWS = 3;
const COLS = 5;
const SPACE_BETWEEN_ALIENS = 6;
const MOVE_SPEED = 2;
const STEP_DOWN = 5;
const RIGHT_BORDER = 95;
const LEFT_BORDER = 5;
const MOVEMENT_INTERVAL_MS = 100;

function createAlienArray() {
    const alienArray = [];
    let id = 0;
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            alienArray.push({ id: id++, row: i, col: j, alive: true });
        }
    }
    return alienArray;
}

function AlienFormation({onAliensChange, gameOver = false}) {
    const [offsetX, setOffsetX] = useState(20);
    const [offsetY, setOffsetY] = useState(5);
    const [alienArray, setAlienArray] = useState(createAlienArray());
    const direction = useRef(1); // right = 1 left = -1
    const gameOverRef = useRef(gameOver);

    useEffect(() => {
        gameOverRef.current = gameOver;
    }, [gameOver]);

    const findAliveColumnBounds = () => {
        const aliveCols = alienArray
            .filter((alien) => alien.alive)
            .map((alien) => alien.col);
        if (aliveCols.length === 0) {
            return {
                right: 0,
                left: 0,
            };
        }
        return {
            right: Math.max(...aliveCols),
            left: Math.min(...aliveCols),
        };
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (gameOverRef.current) {
                clearInterval(interval);
                return;
            }

            setOffsetX((prevX) =>{
                const bounds = findAliveColumnBounds();
                const nextX = prevX + (direction.current * MOVE_SPEED);
                const rightEdge = nextX + bounds.right * SPACE_BETWEEN_ALIENS;
                const leftEdge = nextX + bounds.left * SPACE_BETWEEN_ALIENS;
                const hitBorder = rightEdge >= RIGHT_BORDER || leftEdge <= LEFT_BORDER;

                if(hitBorder) {
                    direction.current *= -1;
                    setOffsetY(prevY => prevY + STEP_DOWN);
                    return prevX;
                }

                return nextX;
            });
        }, MOVEMENT_INTERVAL_MS)

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (onAliensChange) {
            const positions = alienArray.filter(alien => alien.alive).map(alien => ({
                id: alien.id,
                xPercent: offsetX + alien.col * SPACE_BETWEEN_ALIENS,
                yPercent: offsetY + alien.row * SPACE_BETWEEN_ALIENS,
            }));
            onAliensChange(positions);
        }
    }, [offsetX, offsetY, alienArray, onAliensChange]);

    return (
        <>
            {alienArray.map((alien) => (
                <Alien
                    key={alien.id}
                    XPosition={offsetX + alien.col * SPACE_BETWEEN_ALIENS}
                    YPosition={offsetY + alien.row * SPACE_BETWEEN_ALIENS}
                    alive={alien.alive}
                />
            ))}
        </>
    );
}

export default AlienFormation;
