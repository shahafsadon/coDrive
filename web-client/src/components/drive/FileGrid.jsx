import { useEffect, useState } from 'react';
import FileCard from './FileCard';
import './drive.css';

function FileGrid() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('http://localhost:3000/api/files', {
                    headers: {
                        // TEMP: hardcoded user id (as in Assignment 3 README)
                        'x-user-id': '1766410886999673',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch files');
                }

                const data = await response.json();

                // API returns { value: [...], Count: n }
                setItems(data.value || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    /*  UI STATES  */

    if (loading) {
        return <div className="loading">Loading files...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (items.length === 0) {
        return <div className="empty-state">No files yet</div>;
    }

    /*  NORMAL RENDER  */

    return (
        <div className="file-grid">
            {items.map(item => (
                <FileCard
                    key={item.id}
                    name={item.name}
                    type={item.type}
                />
            ))}
        </div>
    );
}

export default FileGrid;
