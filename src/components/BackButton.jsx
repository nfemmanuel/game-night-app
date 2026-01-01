import { useNavigate, useLocation } from 'react-router-dom';

function BackButton({ to = '/', preserveState = false }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        if (preserveState && location.state) {
            // Pass along any state (like players list)
            navigate(to, { state: location.state });
        } else {
            navigate(to);
        }
    };

    return (
        <button
            onClick={handleBack}
            className="back-button"
            style={{
                position: 'fixed',
                top: '20px',
                left: '20px',
                padding: '10px 20px',
                fontSize: '1.5rem',
                backgroundColor: 'transparent',
                border: '2px solid white',
                color: 'white',
                cursor: 'pointer',
                borderRadius: '5px',
                zIndex: 1000
            }}
        >
            ← Back
        </button>
    );
}

export default BackButton;