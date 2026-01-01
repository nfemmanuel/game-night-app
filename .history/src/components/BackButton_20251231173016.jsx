import { useNavigate } from 'react-router-dom';

function BackButton({ to = '/' }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(to)}
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