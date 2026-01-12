import './PowerUpNotification.css';

const POWER_UP_CONFIG = {
    machineGun: {
        emoji: '🔫',
        text: 'Press M',
    },
    megaShot: {
        emoji: '💥',
        text: 'Press Z',
    },
    slowDown: {
        emoji: '🐢',
        text: 'Aliens Slowed!',
    },
};

function PowerUpNotification({ type, onDismiss }) {
    const config = POWER_UP_CONFIG[type];
    if (!config) return null;

    return (
        <div className="power-up-notification" onAnimationEnd={onDismiss}>
            <span className="power-up-emoji">{config.emoji}</span>
            <span className="power-up-text">{config.text}</span>
        </div>
    );
}

export default PowerUpNotification;
