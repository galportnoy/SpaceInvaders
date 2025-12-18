import alienImg from '../assets/space_squid.png';
import { useState } from 'react';
import './Alien.css';

function Alien() {
    //may change it to two different variables x and y
    const [position, setPosition] = useState({ x: 50, Y: 90 });

    const dynamicStyle = {
        '--alien-position-x': '${position.x}%',
        '--alien-position-y': '${position.y}%',
    };

    return (
        <div className="alien-container" style={{ dynamicStyle }}>
            <img src={alienImg} alt="alien" />
        </div>
    );
}
export default Alien;