import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import LandingPage from './pages/impoLandingPage';
import ImposterSetup from './pages/imposter/ImposterSetup';
import ImposterReveal from './pages/imposter/ImposterReveal';
import ImposterVoting from './pages/imposter/ImposterVoting';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/imposter-setup" element={<ImposterSetup />} />
        <Route path="/imposter-reveal" element={<ImposterReveal />} />
        <Route path="/imposter-voting" element={<ImposterVoting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;