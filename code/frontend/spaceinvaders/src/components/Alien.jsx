import thirdAlienImg from '../assets/basic_alien.png';
import secondAlienImg from '../assets/space_squid.png';
import firstAlienImg from '../assets/silly_alien.png';
import './Alien.css';
import {ALIEN_TYPES} from '../constants/alienTypes.js';

function Alien({ XPosition, YPosition, type, alive = true }) {
    const dynamicStyle = {
        '--alien-position-x': `${XPosition}%`,
        '--alien-position-y': `${YPosition}%`,
    };

    if (!alive) return null;

    const alienType = () => {
        switch (type) {
            case ALIEN_TYPES.FIRST:
                return firstAlienImg;
            case ALIEN_TYPES.SECOND:
                return secondAlienImg;
            case ALIEN_TYPES.THIRD:
                return thirdAlienImg;
        }
    };

    return (
        <div className="alien-container" style={dynamicStyle}>
            <img src={alienType()} alt="alien" />
        </div>
    );
}
export default Alien;
