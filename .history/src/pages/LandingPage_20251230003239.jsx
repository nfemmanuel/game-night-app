import { useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';

function LandingPage() {
    const navigate = useNavigate();

    const games = [
        // Define your games here
    ];

    return (
        <div>
            {/* Title */}
            {/* Map over games to render GameCard components */}
        </div>
    );
}

export default LandingPage;