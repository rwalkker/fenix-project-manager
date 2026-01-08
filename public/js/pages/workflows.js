// FENIX Project Manager - Workflows Page

export class Workflows {
  constructor(api, app) {
    this.api = api;
    this.app = app;
  }

  async render(container) {
    container.innerHTML = `
      <div class="workflows">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
          <h1>Workflows</h1>
          <button class="btn btn-primary" id="create-workflow-btn">Create Workflow</button>
        </div>

        <div id="workflows-list" class="grid grid-2">
          <p>Loading workflows...</p>
        </div>
      </div>
    `;

    await this.loadWorkflows();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const createBtn = document.getElementById('create-workflow-btn');
    createBtn.addEventListener('click', () => {
      this.app.showNotification('Workflow builder coming soon!', 'info');
    });
  }

  async loadWorkflows() {
    const container = document.getElementById('workflows-list');
    
    try {
      const workflows = await this.api.getWorkflows();
      
      if (!workflows || workflows.length === 0) {
        container.innerHTML = '<p>No workflows found. Create your first workflow!</p>';
        return;
      }

      container.innerHTML = workflows.map(workflow => `
        <div class="card">
          <div class="card-header">${workflow.name}</div>
          <div class="card-body">
            <p>${workflow.description || 'No description'}</p>
            <div class="mt-2">
              <span class="badge badge-${this.getStatusClass(workflow.status)}">
                ${workflow.status}
              </span>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-sm" data-id="${workflow.id}">
              Execute
            </button>
            <button class="btn btn-outline btn-sm" data-id="${workflow.id}">
              View Details
            </button>
          </div>
        </div>
      `).join('');
    } catch (error) {
      container.innerHTML = '<p>Failed to load workflows</p>';
      this.app.showNotification('Failed to load workflows', 'error');
    }
  }

  getStatusClass(status) {
    const map = {
      'complete': 'success',
      'in-progress': 'info',
      'failed': 'error',
      'pending': 'pending',
    };
    return map[status] || 'pending';
  }
}
