import { Link } from 'react-router-dom';
import './StartMenu.css';

const StartMenu = () => {
    return (
        <div className="start-menu">
            <div className="start-menu-hero">
                <h1>Web Cards</h1>
                <p>Pick a game to get started.</p>
            </div>

            <div className="start-menu-grid">
                <Link className="menu-card" to="/blackjack">
                    <div className="menu-card-title">Blackjack</div>
                    <div className="menu-card-subtitle">Classic 21 with animated draws.</div>
                </Link>

                <Link className="menu-card" to="/poker">
                    <div className="menu-card-title">Poker</div>
                    <div className="menu-card-subtitle">Placeholder route.</div>
                </Link>

                <Link className="menu-card" to="/solitaire">
                    <div className="menu-card-title">Solitaire</div>
                    <div className="menu-card-subtitle">Placeholder route.</div>
                </Link>

                <Link className="menu-card" to="/war">
                    <div className="menu-card-title">War</div>
                    <div className="menu-card-subtitle">Placeholder route.</div>
                </Link>
            </div>
        </div>
    );
};

export default StartMenu;
