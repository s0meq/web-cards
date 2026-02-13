import { Link } from 'react-router-dom';
import './StartMenu.css';

const Placeholder = ({ title }) => {
    return (
        <div className="start-menu">
            <div className="start-menu-hero">
                <h1>{title}</h1>
                <p>This page is a placeholder for now.</p>
            </div>
            <Link className="menu-card" to="/">
                <div className="menu-card-title">Back to Start</div>
                <div className="menu-card-subtitle">Choose another game.</div>
            </Link>
        </div>
    );
};

export default Placeholder;
