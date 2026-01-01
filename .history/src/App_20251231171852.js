import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import LandingPage from './pages/LandingPage';
import ImposterSetup from './pages/ImposterSetup';
import ImposterReveal from './pages/ImposterReveal';
import ImposterVoting from './pages/ImposterVoting';

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