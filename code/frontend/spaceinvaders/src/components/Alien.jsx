import alienImg from '../assets/space_squid.png';
import './Alien.css';

function Alien({ XPosition, YPosition, alive = true}) {
    const dynamicStyle = {
        '--alien-position-x': `${XPosition}%`,
        '--alien-position-y': `${YPosition}%`,
    };

    if (!alive) return null;

    return (
        <div className="alien-container" style={dynamicStyle}>
            <img src={alienImg} alt="alien" />
        </div>
    );
}
export default Alien;
