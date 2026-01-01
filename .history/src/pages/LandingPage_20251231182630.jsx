import { useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';
import HelpButton from '../components/HelpButton';

function LandingPage() {
    const navigate = useNavigate();

    const handleClick = (gameName, route) => {
        if (route) {
            navigate(route);
        }
    };

    return (
        <div className="landing-page" style={{ padding: '20px', textAlign: 'center' }}>
            <HelpButton />
            <h1>GAME NIGHT</h1>

            <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                marginTop: '30px',
                flexWrap: 'wrap',
                padding: '0 10px'
            }}>
                <GameCard
                    name="Imposter"
                    available={true}
                    color="orange"
                    onClick={() => handleClick("Imposter", "/imposter-setup")}
                />
                <GameCard
                    name="UNO"
                    available={false}
                    color="blue"
                    onClick={() => handleClick("UNO", "/uno-setup")}
                />
                <GameCard
                    name="Untitled"
                    available={false}
                    onClick={() => { }}
                />
                <GameCard
                    name="Untitled"
                    available={false}
                    onClick={() => { }}
                />
            </div>
        </div>
    );
}

export default LandingPage;