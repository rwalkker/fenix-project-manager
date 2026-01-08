// FENIX Project Manager - Settings Page

export class Settings {
  constructor(api, app) {
    this.api = api;
    this.app = app;
  }

  async render(container) {
    container.innerHTML = `
      <div class="settings">
        <h1 class="mb-3">Settings</h1>

        <div class="card mb-3">
          <div class="card-header">User Preferences</div>
          <div class="card-body">
            <form id="preferences-form">
              <div class="form-group">
                <label class="form-label">Default Document Type</label>
                <select class="form-select" id="default-type">
                  <option value="powerpoint">PowerPoint</option>
                  <option value="excel">Excel</option>
                  <option value="word">Word</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Default Template</label>
                <select class="form-select" id="default-template">
                  <option value="">None</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary">Save Preferences</button>
            </form>
          </div>
        </div>

        <div class="card">
          <div class="card-header">About</div>
          <div class="card-body">
            <p><strong>FENIX Project Manager</strong></p>
            <p>Version 1.0.0</p>
            <p>AI-powered document generation platform</p>
          </div>
        </div>
      </div>
    `;

    await this.loadPreferences();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = document.getElementById('preferences-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.savePreferences();
    });
  }

  async loadPreferences() {
    try {
      const prefs = await this.api.getPreferences();
      if (prefs) {
        document.getElementById('default-type').value = prefs.defaultType || 'powerpoint';
        document.getElementById('default-template').value = prefs.defaultTemplate || '';
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }

  async savePreferences() {
    const data = {
      defaultType: document.getElementById('default-type').value,
      defaultTemplate: document.getElementById('default-template').value,
    };

    try {
      await this.api.updatePreferences(data);
      this.app.showNotification('Preferences saved', 'success');
    } catch (error) {
      this.app.showNotification('Failed to save preferences', 'error');
    }
  }
}
