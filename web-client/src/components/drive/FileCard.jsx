import './drive.css';

function FileCard({ name, type }) {
    const icon = type === 'folder' ? '📁' : '📄';

    return (
        <div className="file-card">
            <div className="file-icon">{icon}</div>
            <div className="file-name" title={name}>{name}</div>
        </div>
    );
}

export default FileCard;
