import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ImposterSetup from './pages/imposter/ImposterSetup';
import ImposterReveal from './pages/imposter/ImposterReveal';
import ImposterVoting from './pages/imposter/ImposterVoting';
import UnoTest from './pages/uno/UnoTest';
import UnoLogicTest from './pages/uno/UnoLogicTest';
import UnoGame from './pages/uno/UnoGame';
import UnoSetup from './pages/uno/UnoSetup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/imposter-setup" element={<ImposterSetup />} />
        <Route path="/imposter-reveal" element={<ImposterReveal />} />
        <Route path="/imposter-voting" element={<ImposterVoting />} />
        <Route path="/uno-test" element={<UnoTest />} />
        <Route path="/uno-logic-test" element={<UnoLogicTest />} />
        <Route path="/uno-game" element={<UnoGame />} />
        <Route path="/uno-setup" element={<UnoSetup />} />
      </Routes>
    </Router>
  );
}

export default App;