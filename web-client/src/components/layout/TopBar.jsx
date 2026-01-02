import './TopBar.css';

function TopBar() {
    return (
        <header className="topbar">
            <div className="topbar-left">
                <span className="logo">coDrive</span>
            </div>

            <div className="topbar-right">
                <button className="theme-toggle">🌙</button>
                <div className="user-info">
                    <span className="user-email">user@email.com</span>
                    <button className="logout-btn">Logout</button>
                </div>
            </div>
        </header>
    );
}

export default TopBar;
