// FENIX Project Manager - Dashboard Page

export class Dashboard {
  constructor(api, app) {
    this.api = api;
    this.app = app;
  }

  async render(container) {
    container.innerHTML = `
      <div class="dashboard">
        <h1 class="mb-3">Dashboard</h1>
        
        <div class="grid grid-3 mb-3">
          <div class="quick-action" data-action="powerpoint">
            <div class="quick-action-icon">📊</div>
            <div class="quick-action-title">PowerPoint</div>
            <div class="quick-action-description">Create presentations</div>
          </div>
          
          <div class="quick-action" data-action="excel">
            <div class="quick-action-icon">📈</div>
            <div class="quick-action-title">Excel</div>
            <div class="quick-action-description">Generate workbooks</div>
          </div>
          
          <div class="quick-action" data-action="word">
            <div class="quick-action-icon">📝</div>
            <div class="quick-action-title">Word</div>
            <div class="quick-action-description">Create documents</div>
          </div>
        </div>

        <div class="grid grid-2">
          <div class="card">
            <div class="card-header">Recent Documents</div>
            <div class="card-body" id="recent-documents">
              <p>No recent documents</p>
            </div>
          </div>

          <div class="card">
            <div class="card-header">Quick Stats</div>
            <div class="card-body" id="quick-stats">
              <p>Loading stats...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
    await this.loadStats();
  }

  setupEventListeners() {
    const actions = document.querySelectorAll('.quick-action');
    actions.forEach(action => {
      action.addEventListener('click', () => {
        const type = action.getAttribute('data-action');
        this.app.loadPage('generator');
      });
    });
  }

  async loadStats() {
    const statsContainer = document.getElementById('quick-stats');
    statsContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <div>
          <strong>Total Documents:</strong> 0
        </div>
        <div>
          <strong>Active Workflows:</strong> 0
        </div>
        <div>
          <strong>Templates:</strong> 12
        </div>
      </div>
    `;
  }
}
