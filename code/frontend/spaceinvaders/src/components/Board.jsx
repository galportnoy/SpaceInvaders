import React, { useState } from 'react';
import './Board.css';
import Spaceship from '../components/Spaceship.jsx';
import Alien from '../components/Alien.jsx';

function Board() {
    const [started, setStarted] = useState(false);
    const handleStart = () => setStarted(true);

    const gamePieces = () => {
        return (
            <>
                <Alien />
                <Spaceship />
            </>
        );
    };

    const startButton = () => {
        return (
            <button className="start-button" onClick={handleStart}>
                start
            </button>
        );
    };

    return (
        <div className="board">
            {!started ? startButton() : gamePieces()}
        </div>
    );
}

export default Board;
