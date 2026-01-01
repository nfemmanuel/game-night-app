import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { wordList } from '../data/wordList';
import BackButton from '../components/BackButton';
import HelpButton from '../components/HelpButton';

function ImposterReveal() {
    const location = useLocation();
    const navigate = useNavigate();
    const players = location.state?.players || [];

    // Pick random imposter and word (only once)
    const [imposter] = useState(() =>
        players.length > 0 ? players[Math.floor(Math.random() * players.length)] : null
    );
    const [word] = useState(() =>
        wordList[Math.floor(Math.random() * wordList.length)]
    );

    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [canProceed, setCanProceed] = useState(false);

    // Redirect if no players (AFTER all hooks)
    useEffect(() => {
        if (players.length === 0) {
            navigate('/imposter-setup');
        }
    }, [players.length, navigate]);

    // Timer: Enable Next button 1 second after revealing
    useEffect(() => {
        if (isRevealed) {
            const timer = setTimeout(() => {
                setCanProceed(true);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [isRevealed]);

    // Don't render if no players
    if (players.length === 0) {
        return null;
    }

    const currentPlayer = players[currentPlayerIndex];
    const isImposter = currentPlayer === imposter;

    const handlePressStart = () => {
        setIsRevealed(true);
    };

    const handlePressEnd = () => {
        setIsRevealed(false);
    };

    const nextPlayer = () => {
        if (!canProceed) return; // Don't allow if timer hasn't finished

        setIsRevealed(false);
        setCanProceed(false); // Reset for next player

        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(currentPlayerIndex + 1);
        } else {
            // Game complete - go to voting
            navigate('/imposter-voting', {
                state: { players, imposter, word }
            });
        }
    };

    return (
        <div style={{
            p