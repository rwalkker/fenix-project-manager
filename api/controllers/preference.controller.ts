// FENIX Project Manager - Preference Controller
// Business logic for user preferences
// Created: January 6, 2026

import { Request, Response } from 'express';
import { UserPreferenceService } from '../../services/UserPreferenceService';

export class PreferenceController {
  private preferenceService: UserPreferenceService;

  constructor() {
    this.preferenceService = new UserPreferenceService();
  }

  async getPreferences(_req: Request, res: Response): Promise<void> {
    // For now, use a default user ID
    const userId = 'default-user';
    const preferences = await this.preferenceService.getPreferences(userId);
    
    res.json(preferences);
  }

  async updatePreferences(req: Request, res: Response): Promise<void> {
    const userId = 'default-user';
    const updates = req.body;
    
    await this.preferenceService.updateStylePreferences(userId, updates);
    const preferences = await this.preferenceService.getPreferences(userId);
    
    res.json({
      message: 'Preferences updated successfully',
      preferences,
    });
  }

  async getSmartDefaults(_req: Request, res: Response): Promise<void> {
    const userId = 'default-user';
    const defaults = await this.preferenceService.getSmartDefaults(userId);
    
    res.json(defaults);
  }
}
