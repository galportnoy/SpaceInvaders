import './Projectile.css';

function Projectile({ xPercent, yPx }) {
    return (
        <div
            className="projectile"
            style={{
                left: `${xPercent}%`,
                top: `${yPx}px`,
            }}
        />
    );
}

export default Projectile;

