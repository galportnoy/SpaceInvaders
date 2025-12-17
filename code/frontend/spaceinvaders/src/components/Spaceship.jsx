import playership from '../assets/player_ship.png';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Spaceship.css';

const PLAYER_MOVE_STEP_PERCENT = 2;
const PLAYER_BOTTOM_PERCENT = 3;

export default function Spaceship({ boardElementRef }) {
    const playerElementRef = useRef(null);
    const [playerCenterX, setPlayerCenterX] = useState(50);
    const [playerWidth, setPlayerWidth] = useState(10);

    const updatePlayerWidthFromBoard = () => {
        const boardWidthPx = boardElementRef.current?.clientWidth ?? 0;
        const playerWidthPx = playerElementRef.current?.clientWidth ?? 0;
        if (!boardWidthPx || !playerWidthPx) return;

        setPlayerWidth((playerWidthPx / boardWidthPx) * 100);
    };

    const borderCenterX = (value) => {
        const minCenter = playerWidth / 2;
        const maxCenter = 100 - playerWidth / 2;
        return Math.min(Math.max(value, minCenter), maxCenter);
    };

    useLayoutEffect(() => {
        updatePlayerWidthFromBoard();
        window.addEventListener('resize', updatePlayerWidthFromBoard);
        return () =>
            window.removeEventListener('resize', updatePlayerWidthFromBoard);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();

            const delta =
                event.key === 'ArrowLeft'
                    ? -PLAYER_MOVE_STEP_PERCENT
                    : PLAYER_MOVE_STEP_PERCENT;

            setPlayerCenterX((current) => borderCenterX(current + delta));
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playerWidth]);

    return (
        <div
            className="spaceship-slot"
            ref={playerElementRef}
            style={{
                left: `${playerCenterX}%`,
                bottom: `${PLAYER_BOTTOM_PERCENT}%`,
            }}
        >
            <img src={playership} alt="spaceship" className="spaceship-slot" />
        </div>
    );
}
