import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ImposterSetup from './pages/imposter/ImposterSetup';
import ImposterReveal from './pages/imposter/ImposterReveal';
import ImposterVoting from './pages/imposter/ImposterVoting';
import UnoTest from './pages/uno/UnoTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/imposter-setup" element={<ImposterSetup />} />
        <Route path="/imposter-reveal" element={<ImposterReveal />} />
        <Route path="/imposter-voting" element={<ImposterVoting />} />
      </Routes>
    </Router>
  );
}

export default App;