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
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>  // Changed padding
            <HelpButton />
            <h1 style={{ fontSize: '10rem' }}>Ga</h1>  // Add max-width

            <div style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
                marginTop: '40px',
                flexWrap: 'wrap',
                padding: '0 10px'  // Add padding on sides for mobile
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