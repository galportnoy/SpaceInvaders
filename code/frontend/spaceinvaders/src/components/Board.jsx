import React, { useState } from 'react';
import './Board.css';
import Spaceship from '../components/Spaceship.jsx';

function Board() {
    const [started, setStarted] = useState(false);
    const handleStart = () => setStarted(true);

    return (
        <div className="board">
            {!started && (
                <button className="start-button" onClick={handleStart}>
                    start
                </button>
            )}
            {started &&
                <div className="spaceship-slot">
                    <Spaceship/>
                </div>
                }
        </div>
    );
}

export default Board;
