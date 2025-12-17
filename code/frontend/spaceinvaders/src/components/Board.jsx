import React, { useRef, useState } from 'react';
import './Board.css';
import Spaceship from '../components/Spaceship.jsx';

function Board() {
    const [started, setStarted] = useState(false);
    const handleStart = () => setStarted(true);
    const boardElementRef = useRef(null);

    return (
        <div className="board" ref={boardElementRef}>
            {!started && (
                <button className="start-button" onClick={handleStart}>
                    start
                </button>
            )}
            {started && <Spaceship boardElementRef={boardElementRef} />}
        </div>
    );
}

export default Board;
