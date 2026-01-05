import { useState, useEffect } from 'react';
import storageManager from '../utils/StorageManager';
import { useTheme } from '../contexts/ThemeContext';

function Settings() {
    const { theme, setTheme } = useTheme();
    const [playerName, setPlayerName] = useState(() => storageManager.getPlayerName());
    const [storageInfo, setStorageInfo] = useState(null);

    useEffect(() => {
        setStorageInfo(storageManager.getStorageInfo());
    }, []);

    const handleSaveSettings = () => {
        storageManager.savePlayerName(playerName);
        storageManager.saveTheme(theme);
        alert('Settings saved!');
    };

    const handleClearData = () => {
        if (window.confirm('Clear ALL saved games and settings?')) {
            storageManager.clearAll();
            alert('All data cleared!');
            window.location.reload();
        }
    };

    const handleExportData = () => {
        const data = storageManager.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gamenight-backup-${Date.now()}.json`;
        a.click();
    };

    const handleImportData = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const success = storageManager.importData(event.target.result);
            if (success) {
                alert('Data imported successfully!');
                window.location.reload();
            } else {
                alert('Failed to import data!');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="settings-page">
            <h1>Settings</h1>

            <section>
                <h2>General Settings</h2>

                <label>
                    Default Player Name:
                    <input
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                    />
                </label>

                <label>
                    Theme:
                    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
                </label>

                <button onClick={handleSaveSettings}>Save Settings</button>
            </section>

            <section>
                <h2>Storage Info</h2>
                {storageInfo && (
                    <div>
                        <p>Total Items: {storageInfo.itemCount}</p>
                        <p>Storage Used: {storageInfo.sizeMB} MB ({storageInfo.percentUsed})</p>
                        <p>Estimated Limit: {storageInfo.estimatedLimit}</p>
                    </div>
                )}
            </section>

            <section>
                <h2>Data Management</h2>

                <button onClick={handleExportData}>
                    📥 Export All Data (Backup)
                </button>

                <label>
                    📤 Import Data (Restore):
                    <input type="file" accept=".json" onChange={handleImportData} />
                </label>

                <button onClick={handleClearData} style={{ backgroundColor: 'red' }}>
                    🗑️ Clear All Data
                </button>
            </section>
        </div>
    );
}

export default Settings;