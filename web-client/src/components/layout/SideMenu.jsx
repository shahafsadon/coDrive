import './SideMenu.css';

function SideMenu() {
    return (
        <aside className="side-menu">
            <div className="menu-item active">My Drive</div>
            <div className="menu-item">Recent</div>
            <div className="menu-item">Starred</div>
            <div className="menu-item">Shared</div>
            <div className="menu-item">Trash</div>
        </aside>
    );
}

export default SideMenu;
