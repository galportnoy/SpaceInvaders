const API_BASE = '/api';

export async function saveScore(name, score) {
    return await fetch(`${API_BASE}/save-score/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score }),
    });
}

export async function getLeaderboard() {
    const response = await fetch(`${API_BASE}/leaderboard/`);
    return response.json();
}
