import { NavLink } from "react-router-dom";
import "./SideMenu.css";

function SideMenu() {
    const linkClass = ({ isActive }) =>
        `menu-item ${isActive ? "active" : ""}`;

    return (
        <aside className="side-menu">
            <NavLink to="/drive" className={linkClass}>
                <span className="menu-icon">📁</span>
                <span>My Drive</span>
            </NavLink>

            <NavLink to="/recent" className={linkClass}>
                <span className="menu-icon">🕒</span>
                <span>Recent</span>
            </NavLink>

            <NavLink to="/starred" className={linkClass}>
                <span className="menu-icon">⭐</span>
                <span>Starred</span>
            </NavLink>

            <NavLink to="/shared" className={linkClass}>
                <span className="menu-icon">👥</span>
                <span>Shared with me</span>
            </NavLink>

            <NavLink to="/trash" className={linkClass}>
                <span className="menu-icon">🗑️</span>
                <span>Trash</span>
            </NavLink>
        </aside>
    );
}

export default SideMenu;
