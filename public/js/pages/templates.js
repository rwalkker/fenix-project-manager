// FENIX Project Manager - Templates Page

export class Templates {
  constructor(api, app) {
    this.api = api;
    this.app = app;
    this.currentType = 'all';
  }

  async render(container) {
    container.innerHTML = `
      <div class="templates">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
          <h1>Template Library</h1>
          <button class="btn btn-primary" id="create-template-btn">Create Template</button>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <div class="grid grid-4">
              <button class="btn btn-primary filter-btn active" data-type="all">All</button>
              <button class="btn btn-outline filter-btn" data-type="powerpoint">PowerPoint</button>
              <button class="btn btn-outline filter-btn" data-type="excel">Excel</button>
              <button class="btn btn-outline filter-btn" data-type="word">Word</button>
            </div>
          </div>
        </div>

        <div id="templates-list" class="grid grid-3">
          <p>Loading templates...</p>
        </div>
      </div>
    `;

    await this.loadTemplates();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const createBtn = document.getElementById('create-template-btn');
    createBtn.addEventListener('click', () => {
      this.app.showNotification('Template creator coming soon!', 'info');
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active', 'btn-primary');
          b.classList.add('btn-outline');
        });
        btn.classList.remove('btn-outline');
        btn.classList.add('active', 'btn-primary');
        this.currentType = btn.getAttribute('data-type');
        this.loadTemplates();
      });
    });
  }

  async loadTemplates() {
    const container = document.getElementById('templates-list');
    
    try {
      const type = this.currentType === 'all' ? null : this.currentType;
      const templates = await this.api.getTemplates(type);
      
      if (!templates || templates.length === 0) {
        container.innerHTML = '<p>No templates found</p>';
        return;
      }

      container.innerHTML = templates.map(template => `
        <div class="card">
          <div class="card-header">${template.name}</div>
          <div class="card-body">
            <p>${template.description || 'No description'}</p>
            <div class="mt-2">
              <span class="badge badge-info">${template.type}</span>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-sm" data-id="${template.id}">
              Use Template
            </button>
          </div>
        </div>
      `).join('');
    } catch (error) {
      container.innerHTML = '<p>Failed to load templates</p>';
      this.app.showNotification('Failed to load templates', 'error');
    }
  }
}
