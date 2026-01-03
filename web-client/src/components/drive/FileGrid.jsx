import FileCard from './FileCard';
import './drive.css';

function FileGrid() {
    // Placeholder data (UI-only)
    const items = [
        { id: 1, name: 'Projects', type: 'folder' },
        { id: 2, name: 'Resume.pdf', type: 'file' },
        { id: 3, name: 'Photos', type: 'folder' },
        { id: 4, name: 'Notes.txt', type: 'file' },
    ];

    if (items.length === 0) {
        return <div className="empty-state">No files yet</div>;
    }

    return (
        <div className="file-grid">
            {items.map(item => (
                <FileCard key={item.id} name={item.name} type={item.type} />
            ))}
        </div>
    );
}

export default FileGrid;
