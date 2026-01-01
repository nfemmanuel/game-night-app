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
                    name="Trio"
                    available={false}
                    color="blue"
                    onClick={() => handleClick("UNO", "/trio-setup")}
                />
                <GameCard
                    name="UNO"
                    available={true}
                    color="orange"
                    onClick={() => handleClick("Imposter", "/uno-setup")}
                />
                <GameCard
                    name="UNO: Show 'Em No Mercy"
                    available={false}
                    color="blue"
                    onClick={() => handleClick("UNO", "/uno-nm-setup")}
                />
                <GameCard
                    name="Charades"
                    available={true}
                    color="orange"
                    onClick={() => handleClick("Charades", "/charades-setup")}
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