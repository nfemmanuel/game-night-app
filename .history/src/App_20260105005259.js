import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import ImposterSetu from './pages/ImposterGame';
import UnoTest from './pages/uno/UnoTest';
import UnoLogicTest from './pages/uno/UnoLogicTest';
import UnoSetup from './pages/uno/UnoSetup';
import UnoGame from './pages/uno/UnoGame';
import UnoNMSetup from './pages/uno-nm/UnoNMSetup';
import UnoNMGame from './pages/uno-nm/UnoNMGame';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Imposter Game Routes */}
          <Route path="/imposter-setup" element={<ImposterGame />} />

          {/* UNO Routes */}
          <Route path="/uno-test" element={<UnoTest />} />
          <Route path="/uno-logic-test" element={<UnoLogicTest />} />
          <Route path="/uno-setup" element={<UnoSetup />} />
          <Route path="/uno-game" element={<UnoGame />} />

          {/* UNO No Mercy Routes */}
          <Route path="/uno-nm-setup" element={<UnoNMSetup />} />
          <Route path="/uno-nm-game" element={<UnoNMGame />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;