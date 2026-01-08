// FENIX Project Manager - Documents Page

import { PreviewComponent } from '../components/preview.js';

export class Documents {
  constructor(api, app) {
    this.api = api;
    this.app = app;
    this.preview = new PreviewComponent(api);
  }

  async render(container) {
    container.innerHTML = `
      <div class="documents">
        <h1 class="mb-3">Document Manager</h1>

        <div class="card mb-3">
          <div class="card-body">
            <input type="text" class="form-input" id="search-input" 
                   placeholder="Search documents...">
          </div>
        </div>

        <div id="documents-list">
          <p>No documents generated yet. Start by creating a document!</p>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
      this.filterDocuments(e.target.value);
    });
  }

  filterDocuments(query) {
    // Placeholder for search functionality
    console.log('Searching for:', query);
  }

  showPreview(documentId) {
    const container = document.body;
    this.preview.showPreview(documentId, container);
  }
}
