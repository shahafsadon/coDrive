import "./SideMenu.css";

function SideMenu() {
    return (
        <aside className="side-menu">
            <div className="menu-item active">
                <span className="menu-icon">📁</span>
                <span>My Drive</span>
            </div>

            <div className="menu-item">
                <span className="menu-icon">🕒</span>
                <span>Recent</span>
            </div>

            <div className="menu-item">
                <span className="menu-icon">⭐</span>
                <span>Starred</span>
            </div>

            <div className="menu-item">
                <span className="menu-icon">👥</span>
                <span>Shared</span>
            </div>

            <div className="menu-item">
                <span className="menu-icon">🗑️</span>
                <span>Trash</span>
            </div>
        </aside>
    );
}

export default SideMenu;
