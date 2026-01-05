// src/utils/StorageManager.js
// Comprehensive localStorage manager for Game Night App

class StorageManager {
    constructor() {
        this.KEYS = {
            // General Settings
            PLAYER_NAME: 'gamenight_player_name',
            THEME: 'gamenight_theme',
            CURRENT_TAB: 'gamenight_current_tab',

            // Game-specific settings (prefixed with game name)
            GAME_SETTINGS: 'gamenight_settings_', // + game name

            // Saved games (prefixed with game name)
            SAVED_GAMES: 'gamenight_saves_', // + game name

            // All saved games list
            SAVED_GAMES_LIST: 'gamenight_all_saves'
        };
    }

    // ============================================
    // GENERAL SETTINGS
    // ============================================

    /**
     * Save player's default name
     */
    savePlayerName(name) {
        try {
            localStorage.setItem(this.KEYS.PLAYER_NAME, name);
            return true;
        } catch (e) {
            console.error('Failed to save player name:', e);
            return false;
        }
    }

    /**
     * Get player's default name
     */
    getPlayerName() {
        return localStorage.getItem(this.KEYS.PLAYER_NAME) || 'Player 1';
    }

    /**
     * Save current theme
     */
    saveTheme(theme) {
        try {
            localStorage.setItem(this.KEYS.THEME, theme);
            return true;
        } catch (e) {
            console.error('Failed to save theme:', e);
            return false;
        }
    }

    /**
     * Get current theme
     */
    getTheme() {
        return localStorage.getItem(this.KEYS.THEME) || 'dark';
    }

    /**
     * Save current tab on landing page
     */
    saveCurrentTab(tabIndex) {
        try {
            localStorage.setItem(this.KEYS.CURRENT_TAB, tabIndex.toString());
            return true;
        } catch (e) {
            console.error('Failed to save current tab:', e);
            return false;
        }
    }

    /**
     * Get current tab on landing page
     */
    getCurrentTab() {
        const tab = localStorage.getItem(this.KEYS.CURRENT_TAB);
        return tab ? parseInt(tab, 10) : 0;
    }

    // ============================================
    // GAME-SPECIFIC SETTINGS
    // ============================================

    /**
     * Save game-specific settings (difficulty, player count, etc.)
     * @param {string} gameName - e.g., 'uno-nm', 'imposter', 'trivia'
     * @param {object} settings - Any game settings
     */
    saveGameSettings(gameName, settings) {
        try {
            const key = this.KEYS.GAME_SETTINGS + gameName;
            localStorage.setItem(key, JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error(`Failed to save settings for ${gameName}:`, e);
            return false;
        }
    }

    /**
     * Get game-specific settings
     */
    getGameSettings(gameName) {
        try {
            const key = this.KEYS.GAME_SETTINGS + gameName;
            const settings = localStorage.getItem(key);
            return settings ? JSON.parse(settings) : null;
        } catch (e) {
            console.error(`Failed to load settings for ${gameName}:`, e);
            return null;
        }
    }

    // ============================================
    // SAVED GAMES
    // ============================================

    /**
     * Save a game state
     * @param {string} gameName - e.g., 'uno-nm'
     * @param {object} gameState - Complete game state
     * @param {string} saveName - Optional custom name
     * @returns {string} - Save ID
     */
    saveGame(gameName, gameState, saveName = null) {
        try {
            const saveId = `${gameName}_${Date.now()}`;
            const save = {
                id: saveId,
                gameName: gameName,
                saveName: saveName || `Auto Save ${new Date().toLocaleString()}`,
                timestamp: Date.now(),
                gameState: gameState
            };

            // Save the game
            const key = this.KEYS.SAVED_GAMES + saveId;
            localStorage.setItem(key, JSON.stringify(save));

            // Add to saved games list
            this._addToSavesList(saveId, gameName);

            return saveId;
        } catch (e) {
            console.error('Failed to save game:', e);
            // Check if storage is full
            if (e.name === 'QuotaExceededError') {
                alert('Storage full! Please delete old saves.');
            }
            return null;
        }
    }

    /**
     * Load a saved game
     */
    loadGame(saveId) {
        try {
            const key = this.KEYS.SAVED_GAMES + saveId;
            const save = localStorage.getItem(key);
            return save ? JSON.parse(save) : null;
        } catch (e) {
            console.error('Failed to load game:', e);
            return null;
        }
    }

    /**
     * Get all saved games for a specific game
     */
    getSavedGames(gameName = null) {
        try {
            const list = this._getSavesList();

            if (gameName) {
                // Filter by game name
                return list.filter(save => save.gameName === gameName);
            }

            return list;
        } catch (e) {
            console.error('Failed to get saved games:', e);
            return [];
        }
    }

    /**
     * Delete a saved game
     */
    deleteSave(saveId) {
        try {
            // Delete the save
            const key = this.KEYS.SAVED_GAMES + saveId;
            localStorage.removeItem(key);

            // Remove from list
            this._removeFromSavesList(saveId);

            return true;
        } catch (e) {
            console.error('Failed to delete save:', e);
            return false;
        }
    }

    /**
     * Delete all saves for a game
     */
    deleteAllSaves(gameName) {
        try {
            const saves = this.getSavedGames(gameName);
            saves.forEach(save => this.deleteSave(save.id));
            return true;
        } catch (e) {
            console.error('Failed to delete all saves:', e);
            return false;
        }
    }

    // ============================================
    // PRIVATE HELPERS
    // ============================================

    _getSavesList() {
        try {
            const list = localStorage.getItem(this.KEYS.SAVED_GAMES_LIST);
            return list ? JSON.parse(list) : [];
        } catch (e) {
            console.error('Failed to get saves list:', e);
            return [];
        }
    }

    _addToSavesList(saveId, gameName) {
        try {
            const list = this._getSavesList();

            // Don't add duplicates
            if (list.find(s => s.id === saveId)) {
                return;
            }

            list.push({
                id: saveId,
                gameName: gameName,
                timestamp: Date.now()
            });

            // Sort by timestamp (newest first)
            list.sort((a, b) => b.timestamp - a.timestamp);

            localStorage.setItem(this.KEYS.SAVED_GAMES_LIST, JSON.stringify(list));
        } catch (e) {
            console.error('Failed to add to saves list:', e);
        }
    }

    _removeFromSavesList(saveId) {
        try {
            const list = this._getSavesList();
            const filtered = list.filter(s => s.id !== saveId);
            localStorage.setItem(this.KEYS.SAVED_GAMES_LIST, JSON.stringify(filtered));
        } catch (e) {
            console.error('Failed to remove from saves list:', e);
        }
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    /**
     * Get storage usage information
     */
    getStorageInfo() {
        try {
            let totalSize = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    totalSize += localStorage[key].length + key.length;
                }
            }

            // Estimate in KB
            const sizeKB = totalSize / 1024;
            const sizeMB = sizeKB / 1024;

            return {
                totalSize: totalSize,
                sizeKB: sizeKB.toFixed(2),
                sizeMB: sizeMB.toFixed(2),
                itemCount: Object.keys(localStorage).length,
                // Most browsers allow 5-10MB
                estimatedLimit: '5-10 MB',
                percentUsed: ((sizeMB / 5) * 100).toFixed(1) + '%'
            };
        } catch (e) {
            console.error('Failed to get storage info:', e);
            return null;
        }
    }

    /**
     * Clear all game night app data
     */
    clearAll() {
        try {
            // Get all keys that start with 'gamenight_'
            const keys = Object.keys(localStorage).filter(key =>
                key.startsWith('gamenight_')
            );

            keys.forEach(key => localStorage.removeItem(key));

            return true;
        } catch (e) {
            console.error('Failed to clear all data:', e);
            return false;
        }
    }

    /**
     * Export all data as JSON (for backup)
     */
    exportData() {
        try {
            const data = {};

            for (let key in localStorage) {
                if (key.startsWith('gamenight_')) {
                    data[key] = localStorage.getItem(key);
                }
            }

            return JSON.stringify(data, null, 2);
        } catch (e) {
            console.error('Failed to export data:', e);
            return null;
        }
    }

    /**
     * Import data from JSON (restore backup)
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            for (let key in data) {
                if (key.startsWith('gamenight_')) {
                    localStorage.setItem(key, data[key]);
                }
            }

            return true;
        } catch (e) {
            console.error('Failed to import data:', e);
            return false;
        }
    }
}

// Export singleton instance
const storageManager = new StorageManager();
export default storageManager;