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
                gap: '8px',
                justifyContent: 'center',
                marginTop: '30px',
                flexWrap: 'wrap',
                padding: '0 8px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <GameCard
                    name="Imposter"
                    available={true}
                    color="orange"
                    onClick={() => handleClick("Imposter", "/imposter-setup")}
                />
                <GameCard
                    name="Mafia"
                    available={false}
                    color="blue"
                    onClick={() => handleClick("Mafia", "/mafia-setup")}
                />
                <GameCard
                    name="Trio"
                    available={false}
                    color="orange"
                    onClick={() => handleClick("Trio", "/trio-setup")}
                />
                <GameCard
                    name="UNO"
                    available={false}
                    color="blue"
                    onClick={() => handleClick("UNO", "/uno-setup")}
                />
                <GameCard
                    name="UNO: Show 'Em No Mercy"
                    available={false}
                    color="orange"
                    onClick={() => handleClick("UNO-NM", "/uno-nm-setup")}
                />
                <GameCard
                    name="Charades"
                    available={false}
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