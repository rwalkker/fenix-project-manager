// FENIX Project Manager - API Client
// Handles all API communication with the backend

export class API {
  constructor(baseURL = `${window.location.origin}/api/v1`) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('fenix_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authentication token if available
    if (this.token) {
      config.headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          this.handleUnauthorized();
        }
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  handleUnauthorized() {
    // For public access, don't redirect to login automatically
    // Only clear token if it exists
    if (this.token) {
      console.log('Token invalid, clearing authentication');
      this.clearToken();
    }
    // Don't redirect - let the app handle public access
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('fenix_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('fenix_token');
    localStorage.removeItem('fenix_user');
  }

  // Authentication
  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async logout() {
    await this.request('/auth/logout', {
      method: 'POST',
    });
    this.clearToken();
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async regenerateApiKey() {
    return this.request('/auth/api-key/regenerate', {
      method: 'POST',
    });
  }

  // Document Generation
  async generatePowerPoint(data) {
    return this.request('/generate/powerpoint', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateExcel(data) {
    return this.request('/generate/excel', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateWord(data) {
    return this.request('/generate/word', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async executeWorkflow(data) {
    return this.request('/generate/workflow', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Process Improvement Tools
  async generateProcessMap(data) {
    return this.request('/generate/process-map', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateFishboneDiagram(data) {
    return this.request('/generate/fishbone-diagram', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateFiveWhys(data) {
    return this.request('/generate/5-whys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGenerationStatus(id) {
    return this.request(`/generate/status/${id}`);
  }

  getDownloadURL(id) {
    return `${this.baseURL}/generate/download/${id}`;
  }

  // Templates
  async getTemplates(type = null) {
    const endpoint = type ? `/templates/${type}` : '/templates';
    return this.request(endpoint);
  }

  async getTemplate(id) {
    return this.request(`/templates/${id}`);
  }

  async createTemplate(data) {
    return this.request('/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTemplate(id, data) {
    return this.request(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTemplate(id) {
    return this.request(`/templates/${id}`, {
      method: 'DELETE',
    });
  }

  // Workflows
  async getWorkflows() {
    return this.request('/workflows');
  }

  async getWorkflow(id) {
    return this.request(`/workflows/${id}`);
  }

  async createWorkflow(data) {
    return this.request('/workflows', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async executeWorkflowById(id) {
    return this.request(`/workflows/${id}/execute`, {
      method: 'POST',
    });
  }

  async getWorkflowStatus(id) {
    return this.request(`/workflows/${id}/status`);
  }

  async cancelWorkflow(id) {
    return this.request(`/workflows/${id}`, {
      method: 'DELETE',
    });
  }

  // AI Services
  async summarizeDocument(data) {
    return this.request('/ai/summarize', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async extractKeyPoints(data) {
    return this.request('/ai/extract-points', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async analyzeSentiment(data) {
    return this.request('/ai/analyze-sentiment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkReadability(data) {
    return this.request('/ai/check-readability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkCompliance(data) {
    return this.request('/ai/check-compliance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async recommendFormat(data) {
    return this.request('/ai/recommend-format', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Preferences
  async getPreferences() {
    return this.request('/preferences');
  }

  async updatePreferences(data) {
    return this.request('/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async learnFromAction(data) {
    return this.request('/preferences/learn', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSmartDefaults(context) {
    return this.request('/preferences/defaults', {
      method: 'POST',
      body: JSON.stringify(context),
    });
  }

  // Projects
  async getProjects() {
    return this.request('/projects');
  }

  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  async createProject(data) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id, data) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async getProjectDocuments(id) {
    return this.request(`/projects/${id}/documents`);
  }

  // Preview
  async getPreview(id) {
    return this.request(`/preview/${id}`);
  }

  async getPreviewMetadata(id) {
    return this.request(`/preview/${id}/metadata`);
  }

  async getPreviewThumbnail(id) {
    return this.request(`/preview/${id}/thumbnail`);
  }

  // Dynamic Theming
  async getThemeSuggestions(data) {
    return this.request('/generate/theme-suggestions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getThemeHistory() {
    return this.request('/generate/theme-history');
  }

  async rateTheme(themeId, rating) {
    return this.request('/generate/rate-theme', {
      method: 'POST',
      body: JSON.stringify({ themeId, rating }),
    });
  }

  // Document Management
  async listDocuments() {
    return this.request('/generate/list');
  }

  async deleteDocument(id) {
    return this.request(`/generate/${id}`, {
      method: 'DELETE',
    });
  }
}
