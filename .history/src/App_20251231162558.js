import './styles/global.css';
import GameCard from './components/GameCard';

function App() {
  const handleClick = (gameName) => {
    alert(`GGetting r ${gameName}!`);
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>GAME NIGHT 🎮</h1>

      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        marginTop: '40px',
        flexWrap: 'wrap'
      }}>
        <GameCard
          name="Imposter"
          available={true}
          onClick={() => handleClick("Imposter")}
        />
        <GameCard
          name="UNO"
          available={false}
          onClick={() => handleClick("UNO")}
        />
        <GameCard
          name="Coming Soon"
          available={false}
          onClick={() => { }}
        />
        <GameCard
          name="Coming Soon"
          available={false}
          onClick={() => { }}
        />
      </div>
    </div>
  );
}

export default App;