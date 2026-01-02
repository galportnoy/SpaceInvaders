import thirdAlienImg from '../assets/basic_alien.png';
import secondAlienImg from '../assets/space_squid.png';
import firstAlienImg from '../assets/silly_alien.png';
import './Alien.css';

function Alien({ XPosition, YPosition, type, alive = true }) {
    const dynamicStyle = {
        '--alien-position-x': `${XPosition}%`,
        '--alien-position-y': `${YPosition}%`,
    };

    if (!alive) return null;

    const alienType = () => {
        switch (type) {
            case 1:
                return firstAlienImg;
            case 2:
                return secondAlienImg;
            case 3:
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
