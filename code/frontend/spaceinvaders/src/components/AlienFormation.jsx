import {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from 'react';
import Alien from './Alien.jsx';
import { ALIEN_TYPES } from '../constants/alienTypes.js';

const ROWS = 5;
const COLS = 10;
const SPACE_BETWEEN_ALIENS = 6;
const MOVE_SPEED = 2;
const STEP_DOWN = 5;
const RIGHT_BORDER = 95;
const LEFT_BORDER = 5;
const MOVEMENT_INTERVAL_MS = 100;

function createAlienArray() {
    const alienArray = [];
    let id = 0;
    let type = ALIEN_TYPES.FIRST;
    for (let row = 0; row < ROWS; row++) {
        if (row % 2 === 1) {
            type += 1;
        }
        for (let col = 0; col < COLS; col++) {
            alienArray.push({ id: id++, row, col, type, alive: true });
        }
    }
    return alienArray;
}

const AlienFormation = forwardRef(function AlienFormation(
    { onAliensChange, gameOver = false },
    ref
) {
    const [offsetX, setOffsetX] = useState(20);
    const [offsetY, setOffsetY] = useState(5);
    const [alienArray, setAlienArray] = useState(createAlienArray());
    const direction = useRef(1); // right = 1 left = -1
    const gameOverRef = useRef(gameOver);
    const alienArrayRef = useRef(alienArray);

    useEffect(() => {
        gameOverRef.current = gameOver;
    }, [gameOver]);

    useEffect(() => {
        alienArrayRef.current = alienArray;
    }, [alienArray]);

    const respawnFormation = () => {
        setOffsetX(20);
        setOffsetY(5);
        direction.current = 1;
        setAlienArray(createAlienArray());
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (gameOverRef.current) {
                clearInterval(interval);
                return;
            }

            const aliveCols = alienArrayRef.current
                .filter((alien) => alien.alive)
                .map((alien) => alien.col);

            if (aliveCols.length === 0) {
                respawnFormation();
                return;
            }

            const boundRight = Math.max(...aliveCols);
            const boundLeft = Math.min(...aliveCols);

            setOffsetX((prevX) => {
                const nextX = prevX + direction.current * MOVE_SPEED;
                const rightEdge = nextX + boundRight * SPACE_BETWEEN_ALIENS;
                const leftEdge = nextX + boundLeft * SPACE_BETWEEN_ALIENS;
                const hitBorder =
                    rightEdge >= RIGHT_BORDER || leftEdge <= LEFT_BORDER;

                if (hitBorder) {
                    direction.current *= -1;
                    setOffsetY((prevY) => prevY + STEP_DOWN);
                    return prevX;
                }

                return nextX;
            });
        }, MOVEMENT_INTERVAL_MS);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (onAliensChange) {
            const positions = alienArray
                .filter((alien) => alien.alive)
                .map((alien) => ({
                    id: alien.id,
                    type: alien.type,
                    xPercent: offsetX + alien.col * SPACE_BETWEEN_ALIENS,
                    yPercent: offsetY + alien.row * SPACE_BETWEEN_ALIENS,
                }));
            onAliensChange(positions);
        }
    }, [offsetX, offsetY, alienArray, onAliensChange]);

    useImperativeHandle(
        ref,
        () => ({
            killAlien: (alienId) => {
                setAlienArray((prevAliens) =>
                    prevAliens.map((alien) =>
                        alien.id === alienId
                            ? { ...alien, alive: false }
                            : alien
                    )
                );
            },
        }),
        []
    );

    return (
        <>
            {alienArray.map((alien) => (
                <Alien
                    key={alien.id}
                    XPosition={offsetX + alien.col * SPACE_BETWEEN_ALIENS}
                    YPosition={offsetY + alien.row * SPACE_BETWEEN_ALIENS}
                    type={alien.type}
                    alive={alien.alive}
                />
            ))}
        </>
    );
});

export default AlienFormation;
