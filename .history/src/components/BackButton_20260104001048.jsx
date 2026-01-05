import { useNavigate, useLocation } from 'react-router-dom';

function BackButton({ to, preserveState = false }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        if (preserveState && location.state) {
            navigate(to, { state: location.state });
        } else {
            navigate(to);
        }
    };

    return (
        <button
            onClick={handleBack}
            style={{
                position: 'fixed',
                top: '10px',
                left: '10px',
                padding: '10px 20px',
                fontSize: '1rem',
                backgroundColor: 'transparent',
                border: '2px solid white',
                color: 'white',
                cursor: 'pointer',
                zIndex: 1000,
                borderRadius: '5px'
            }}
        >
            ← Back
        </button>
    );
}

export default BackButton;