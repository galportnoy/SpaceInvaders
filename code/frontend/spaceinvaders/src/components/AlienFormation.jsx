import {useState} from 'react';
import Alien from './Alien.jsx';

const ROWS = 3;
const COLS = 5;
const SPACE_BETWEEN_ALIENS = 6;

function createAlienArray() {
    const alienArray = [];
    let id = 0;
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            alienArray.push({id: id++, row: i, col: j, alive: true});
        }
    }
    return alienArray;
}

function AlienFormation() {
    const [offsetX, setOffsetX] = useState(20);
    const [offsetY, setOffsetY] = useState(5);
    const [alienArray, setAlienArray] = useState(createAlienArray());

    return(
        <>
            {alienArray.map(alien => (
                <Alien
                    key={alien.id}
                    XPosition={offsetX + alien.col * SPACE_BETWEEN_ALIENS}
                    YPosition={offsetY + alien.row * SPACE_BETWEEN_ALIENS}
                    alive={alien.alive}
                />
            ))}
        </>
    )
}

export default AlienFormation;