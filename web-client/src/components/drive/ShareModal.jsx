import React, { useEffect, useState, useCallback } from 'react';
import { getPermissions, addPermission, deletePermission } from '../../services/filesService';
import './drive.css';

export default function ShareModal({ file, onClose }) {
    const [permissions, setPermissions] = useState([]);
    const [username, setUsername] = useState("");
    const [access, setAccess] = useState("read");

    // UseCallback to memoize loadData function
    const loadData = useCallback(async () => {
        if (!file?.id) return;
        try {
            const data = await getPermissions(file.id);
            setPermissions(data || []);
        } catch (e) {
            console.error(e);
        }
    }, [file.id]); 

    // Add loadData to useEffect dependencies
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Handle adding a new permission
    const handleAdd = async () => {
        if (!username) return;
        try {
            await addPermission(file.id, username, access);
            setUsername("");
            loadData();
        } catch (e) {
            alert("User not found or error sharing");
        }
    };

    // Handle deleting a permission
    const handleDelete = async (permId) => {
        await deletePermission(file.id, permId);
        loadData();
    };

    // Render
    return (
        <div className="file-viewer-overlay" onClick={onClose}>
            <div className="create-modal" onClick={e => e.stopPropagation()} style={{ minWidth: '400px' }}>
                <h3>Share "{file.name}"</h3>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <input 
                        type="text"
                        placeholder="Username to invite" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <select value={access} onChange={e => setAccess(e.target.value)} 
                    style={{ padding: '8px', borderRadius: '4px' }}>
                        <option value="read">Read</option>
                        <option value="write">Write</option>
                    </select>
                    <button style={{ margin: 0, background: '#1a73e8', color: 'white' }} 
                    onClick={handleAdd}>Add</button>
                </div>

                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <h4 style={{ fontSize: '14px', color: '#5f6368', marginBottom: '8px' }}>Who has access:</h4>
                    {permissions.length === 0 && <div style={{ fontSize: '13px', 
                        fontStyle: 'italic', color: '#999' }}>Only you</div>}
                    
                    {permissions.map(p => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between',
                         alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                            <span style={{ fontSize: '14px' }}>👤
                                 {p.username || p.userId} <small style={{ color: '#666' }}>({p.access})</small></span>
                            <button 
                                onClick={() => handleDelete(p.id)}
                                style={{ background: 'none', border: 'none',
                                     color: '#d93025', padding: '4px', margin: 0, fontSize: '13px' }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <button onClick={onClose} style={{ margin: 0 }}>Done</button>
                </div>
            </div>
        </div>
    );
}