"use strict";
// FENIX Project Manager - Preference Controller
// Business logic for user preferences
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceController = void 0;
const UserPreferenceService_1 = require("../../services/UserPreferenceService");
class PreferenceController {
    preferenceService;
    constructor() {
        this.preferenceService = new UserPreferenceService_1.UserPreferenceService();
    }
    async getPreferences(_req, res) {
        // For now, use a default user ID
        const userId = 'default-user';
        const preferences = await this.preferenceService.getPreferences(userId);
        res.json(preferences);
    }
    async updatePreferences(req, res) {
        const userId = 'default-user';
        const updates = req.body;
        await this.preferenceService.updateStylePreferences(userId, updates);
        const preferences = await this.preferenceService.getPreferences(userId);
        res.json({
            message: 'Preferences updated successfully',
            preferences,
        });
    }
    async getSmartDefaults(_req, res) {
        const userId = 'default-user';
        const defaults = await this.preferenceService.getSmartDefaults(userId);
        res.json(defaults);
    }
}
exports.PreferenceController = PreferenceController;
//# sourceMappingURL=preference.controller.js.map