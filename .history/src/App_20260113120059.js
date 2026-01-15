import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import ImposterSetup from './pages/imposter/ImposterSetup';
import ImposterReveal from './pages/imposter/ImposterReveal';
import ImposterVoting from './pages/imposter/ImposterVoting';
import UnoTest from './pages/uno/UnoTest';
import UnoLogicTest from './pages/uno/UnoLogicTest';
import UnoSetup from './pages/uno/UnoSetup';
import UnoGame from './pages/uno/UnoGame';
import UnoNMSetup from './pages/uno-nm/UnoNMSetup';
import UnoNMGame from './pages/uno-nm/UnoNMGame';
import MafiaSetup from './pages/mafia/MafiaSetup';
import MafiaGame from './pages/mafia/MafiaGame';
import MafiaReveal from './pages/mafia/MafiaReveal';
import MafiaVoting from './pages/mafia/MafiaVoting';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Imposter Game Routes */}
          <Route path="/imposter-setup" element={<ImposterSetup />} />
          <Route path="/imposter-reveal" element={<ImposterReveal />} />
          <Route path="/imposter-voting" element={<ImposterVoting />} />

          {/* UNO Routes */}
          <Route path="/uno-test" element={<UnoTest />} />
          <Route path="/uno-logic-test" element={<UnoLogicTest />} />
          <Route path="/uno-setup" element={<UnoSetup />} />
          <Route path="/uno-game" element={<UnoGame />} />

          {/* UNO No Mercy Routes */}
          <Route path="/uno-nm-setup" element={<UnoNMSetup />} />
          <Route path="/uno-nm-game" element={<UnoNMGame />} />

          {/* Mafia Routes */}
          <Route path="/mafia-setup" element={<MafiaSetup />} />
          <Route path="/mafia-game" element={<MafiaGame />} />
          <Route path="/mafia-reveal" element={<MafiaReveal />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;