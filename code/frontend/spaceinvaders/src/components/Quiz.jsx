import { useEffect, useState, useRef } from 'react';
import './Quiz.css';

const API_URL = '/api/quiz/';

function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function Quiz({ onComplete }) {
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const fetchedRef = useRef(false);

    const handleAnswer = (answer) => {
        if (selected !== null) return;
        setSelected(answer);
        const isCorrect = answer === decodeHTML(question.correct);
        setTimeout(() => onComplete(isCorrect), 1000);
    };

    const handleSkip = () => {
        onComplete(false);
    };

    const handleRetry = () => {
        setError(false);
        setLoading(true);
        fetchedRef.current = false;
        fetchQuestion();
    };

    const fetchQuestion = () => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        fetch(API_URL)
            .then((res) => {
                if (!res.ok) throw new Error('Network error');
                return res.json();
            })
            .then((data) => {
                if (data.response_code !== 0 || !data.results?.length) {
                    throw new Error('Invalid response');
                }
                const result = data.results[0];
                const allAnswers = shuffleArray([
                    result.correct_answer,
                    ...result.incorrect_answers,
                ]);
                setQuestion({
                    text: decodeHTML(result.question),
                    correct: result.correct_answer,
                });
                setAnswers(allAnswers.map(decodeHTML));
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    if (loading) {
        return (
            <div className="quiz-overlay">
                <div className="quiz-card">
                    <p className="quiz-loading">Loading question...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-overlay">
                <div className="quiz-card">
                    <p className="quiz-loading">Failed to load question</p>
                    <div className="quiz-answers">
                        <button className="quiz-answer" onClick={handleRetry}>
                            Retry
                        </button>
                        <button className="quiz-answer" onClick={handleSkip}>
                            Skip
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-overlay">
            <div className="quiz-card">
                <h2 className="quiz-title">Trivia Time!</h2>
                <p className="quiz-question">{question.text}</p>
                <div className="quiz-answers">
                    {answers.map((answer) => {
                        let className = 'quiz-answer';
                        if (selected !== null) {
                            if (answer === decodeHTML(question.correct)) {
                                className += ' correct';
                            } else if (answer === selected) {
                                className += ' incorrect';
                            }
                        }
                        return (
                            <button
                                key={answer}
                                className={className}
                                onClick={() => handleAnswer(answer)}
                                disabled={selected !== null}
                            >
                                {answer}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Quiz;
