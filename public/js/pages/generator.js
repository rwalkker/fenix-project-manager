// FENIX Project Manager - Document Generator Page

export class Generator {
  constructor(api, app) {
    this.api = api;
    this.app = app;
    this.currentType = 'powerpoint';
    this.currentProcessType = null;
  }

  async render(container) {
    container.innerHTML = `
      <div class="generator">
        <h1 class="mb-3">Generate Document</h1>

        <div class="card mb-3">
          <div class="card-header">Select Document Type</div>
          <div class="card-body">
            <div class="grid grid-4">
              <button class="btn btn-primary type-btn active" data-type="powerpoint">
                📊 PowerPoint
              </button>
              <button class="btn btn-outline type-btn" data-type="excel">
                📈 Excel
              </button>
              <button class="btn btn-outline type-btn" data-type="word">
                📝 Word
              </button>
              <button class="btn btn-outline type-btn" data-type="process-improvement">
                🔄 Process Improvement
              </button>
            </div>
          </div>
        </div>

        <!-- Process Improvement Sub-types -->
        <div id="process-improvement-types" class="card mb-3 hidden">
          <div class="card-header">Process Improvement Tools</div>
          <div class="card-body">
            <div class="grid grid-3">
              <button class="btn btn-outline process-type-btn" data-process-type="process-map">
                🗺️ Process Map
              </button>
              <button class="btn btn-outline process-type-btn" data-process-type="fishbone-diagram">
                🐟 Fishbone Diagram
              </button>
              <button class="btn btn-outline process-type-btn" data-process-type="5-whys">
                ❓ 5 Whys Analysis
              </button>
            </div>
            <div class="mt-2">
              <small class="text-muted">
                <strong>Process Map:</strong> Visual workflow with swim lanes and decision points<br>
                <strong>Fishbone:</strong> Root cause analysis using the 6M method<br>
                <strong>5 Whys:</strong> Deep dive analysis asking "why" five times
              </small>
            </div>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-header">Document Details</div>
          <div class="card-body">
            <form id="generate-form">
              <div class="form-group">
                <label class="form-label">Title</label>
                <input type="text" class="form-input" id="doc-title" required 
                       placeholder="Enter document title">
              </div>

              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" id="doc-description" 
                          placeholder="Enter document description"></textarea>
              </div>

              <!-- Process Improvement specific fields -->
              <div id="process-improvement-fields" class="hidden">
                <div class="form-group">
                  <label class="form-label">Problem Statement</label>
                  <textarea class="form-textarea" id="problem-statement" 
                            placeholder="Describe the problem you want to analyze"></textarea>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Template</label>
                <select class="form-select" id="doc-template">
                  <option value="">Default Template</option>
                </select>
              </div>

              <!-- File Upload Section -->
              <div class="form-group">
                <label class="form-label">📎 Attach Files (Optional)</label>
                <div class="file-upload-area" id="file-upload-area">
                  <input type="file" id="file-input" multiple accept=".pdf,.docx,.xlsx,.pptx,.txt,.csv,.json,.md" style="display: none;">
                  <div class="upload-dropzone" id="upload-dropzone">
                    <div class="upload-icon">📁</div>
                    <div class="upload-text">
                      <strong>Click to upload files</strong> or drag and drop
                    </div>
                    <div class="upload-help">
                      Supported: PDF, Word, Excel, PowerPoint, Text, CSV, JSON, Markdown
                    </div>
                  </div>
                  <div id="uploaded-files" class="uploaded-files hidden"></div>
                </div>
                <small class="form-help">🤖 AI agents will analyze uploaded files to enhance document content and structure</small>
              </div>

              <div class="form-group">
                <label class="form-label">Content</label>
                <textarea class="form-textarea" id="doc-content" rows="8"
                          placeholder="Describe what you want in the document. For example:&#10;&#10;Create a presentation about Q1 sales results with:&#10;- Title slide with company logo&#10;- Overview of key metrics&#10;- Regional performance breakdown&#10;- Top 5 products by revenue&#10;- Recommendations for Q2&#10;&#10;Or paste JSON if you prefer: {&quot;slides&quot;: [...]}&#10;&#10;💡 If you've uploaded files, mention them here: 'Use the data from the uploaded Excel file to create charts'"></textarea>
                <small class="form-help">💡 Describe your content in plain English - AI will structure it for you! Mention uploaded files for AI to analyze them.</small>
              </div>

              <!-- Dynamic Theme Selection (PowerPoint only) -->
              <div id="theme-selection" class="form-group hidden">
                <label class="form-label">🎨 Dynamic Theme Selection</label>
                <div class="theme-options">
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="theme-auto" name="theme-mode" value="auto" checked>
                    <label class="form-check-label" for="theme-auto">
                      <strong>AI-Powered Theme</strong> - Let AI create a custom theme based on your content
                    </label>
                  </div>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="theme-amazon" name="theme-mode" value="amazon">
                    <label class="form-check-label" for="theme-amazon">
                      <strong>Amazon Theme</strong> - Classic Amazon orange and blue branding
                    </label>
                  </div>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="theme-custom" name="theme-mode" value="custom">
                    <label class="form-check-label" for="theme-custom">
                      <strong>Custom Preferences</strong> - Specify your theme preferences
                    </label>
                  </div>
                </div>

                <!-- Custom Theme Preferences -->
                <div id="custom-theme-options" class="mt-3 hidden">
                  <div class="grid grid-2">
                    <div class="form-group">
                      <label class="form-label">Content Type</label>
                      <select class="form-select" id="theme-content-type">
                        <option value="business">Business</option>
                        <option value="technical">Technical</option>
                        <option value="creative">Creative</option>
                        <option value="educational">Educational</option>
                        <option value="financial">Financial</option>
                        <option value="marketing">Marketing</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Mood</label>
                      <select class="form-select" id="theme-mood">
                        <option value="professional">Professional</option>
                        <option value="energetic">Energetic</option>
                        <option value="calm">Calm</option>
                        <option value="innovative">Innovative</option>
                        <option value="trustworthy">Trustworthy</option>
                        <option value="playful">Playful</option>
                      </select>
                    </div>
                  </div>
                  <div class="grid grid-2">
                    <div class="form-group">
                      <label class="form-label">Audience</label>
                      <select class="form-select" id="theme-audience">
                        <option value="executive">Executive</option>
                        <option value="technical">Technical</option>
                        <option value="general">General</option>
                        <option value="creative">Creative</option>
                        <option value="academic">Academic</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Industry (Optional)</label>
                      <input type="text" class="form-input" id="theme-industry" placeholder="e.g., Technology, Healthcare">
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Favorite Colors (Optional)</label>
                    <input type="text" class="form-input" id="theme-colors" placeholder="e.g., blue, green, orange">
                    <small class="form-help">Comma-separated color names or hex codes</small>
                  </div>
                </div>

                <!-- Theme Suggestions -->
                <div id="theme-suggestions" class="mt-3">
                  <button type="button" class="btn btn-outline btn-sm" id="get-theme-suggestions">
                    ✨ Get AI Theme Suggestions
                  </button>
                  <div id="suggestions-list" class="mt-2 hidden"></div>
                </div>

                <!-- Theme History -->
                <div id="theme-history" class="mt-3">
                  <button type="button" class="btn btn-outline btn-sm" id="show-theme-history">
                    📚 View Theme History
                  </button>
                  <div id="history-list" class="mt-2 hidden"></div>
                </div>
              </div>

              <button type="submit" class="btn btn-primary">
                Generate Document
              </button>
            </form>
          </div>
        </div>

        <div id="generation-status" class="card hidden">
          <div class="card-header">Generation Status</div>
          <div class="card-body">
            <div class="progress mb-2">
              <div class="progress-bar" id="progress-bar" style="width: 0%">0%</div>
            </div>
            <p id="status-message">Initializing...</p>
            <div id="download-section" class="hidden mt-2">
              <a href="#" id="download-link" class="btn btn-success">Download Document</a>
            </div>
          </div>
        </div>
      </div>
    `;

    await this.loadTemplates();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const typeBtns = document.querySelectorAll('.type-btn');
    typeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        typeBtns.forEach(b => {
          b.classList.remove('active', 'btn-primary');
          b.classList.add('btn-outline');
        });
        btn.classList.remove('btn-outline');
        btn.classList.add('active', 'btn-primary');
        this.currentType = btn.getAttribute('data-type');
        
        // Show/hide process improvement sub-types
        const processTypesCard = document.getElementById('process-improvement-types');
        const processFields = document.getElementById('process-improvement-fields');
        const themeSelection = document.getElementById('theme-selection');
        
        if (this.currentType === 'process-improvement') {
          processTypesCard.classList.remove('hidden');
          processFields.classList.remove('hidden');
          themeSelection.classList.add('hidden');
          // Reset process type selection
          this.currentProcessType = null;
          document.querySelectorAll('.process-type-btn').forEach(b => {
            b.classList.remove('active', 'btn-primary');
            b.classList.add('btn-outline');
          });
        } else {
          processTypesCard.classList.add('hidden');
          processFields.classList.add('hidden');
          
          // Show theme selection for PowerPoint
          if (this.currentType === 'powerpoint') {
            themeSelection.classList.remove('hidden');
          } else {
            themeSelection.classList.add('hidden');
          }
        }
        
        this.loadTemplates();
      });
    });

    // Process improvement sub-type buttons
    const processTypeBtns = document.querySelectorAll('.process-type-btn');
    processTypeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        processTypeBtns.forEach(b => {
          b.classList.remove('active', 'btn-primary');
          b.classList.add('btn-outline');
        });
        btn.classList.remove('btn-outline');
        btn.classList.add('active', 'btn-primary');
        this.currentProcessType = btn.getAttribute('data-process-type');
      });
    });

    // Theme selection radio buttons
    const themeRadios = document.querySelectorAll('input[name="theme-mode"]');
    themeRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        const customOptions = document.getElementById('custom-theme-options');
        if (radio.value === 'custom') {
          customOptions.classList.remove('hidden');
        } else {
          customOptions.classList.add('hidden');
        }
      });
    });

    // Theme suggestions button
    const suggestionsBtn = document.getElementById('get-theme-suggestions');
    if (suggestionsBtn) {
      suggestionsBtn.addEventListener('click', () => {
        this.getThemeSuggestions();
      });
    }

    // Theme history button
    const historyBtn = document.getElementById('show-theme-history');
    if (historyBtn) {
      historyBtn.addEventListener('click', () => {
        this.showThemeHistory();
      });
    }

    const form = document.getElementById('generate-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.generateDocument();
    });

    // File upload functionality
    this.setupFileUpload();
  }

  setupFileUpload() {
    const fileInput = document.getElementById('file-input');
    const dropzone = document.getElementById('upload-dropzone');
    const uploadedFilesDiv = document.getElementById('uploaded-files');
    
    this.uploadedFiles = [];

    // Click to upload
    dropzone.addEventListener('click', () => {
      fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
      this.handleFiles(e.target.files);
    });

    // Drag and drop
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      this.handleFiles(e.dataTransfer.files);
    });
  }

  async handleFiles(files) {
    const uploadedFilesDiv = document.getElementById('uploaded-files');
    
    for (let file of files) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'text/csv',
        'application/json',
        'text/markdown'
      ];
      
      const allowedExtensions = ['.pdf', '.docx', '.xlsx', '.pptx', '.txt', '.csv', '.json', '.md'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        this.app.showNotification(`File type not supported: ${file.name}`, 'error');
        continue;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.app.showNotification(`File too large (max 10MB): ${file.name}`, 'error');
        continue;
      }

      try {
        this.app.showLoading(`Uploading ${file.name}...`);
        
        // Upload file
        const uploadResult = await this.uploadFile(file);
        
        // Add to uploaded files list
        this.uploadedFiles.push({
          id: uploadResult.fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          analysis: uploadResult.analysis
        });

        // Update UI
        this.updateUploadedFilesDisplay();
        
        this.app.showNotification(`File uploaded successfully: ${file.name}`, 'success');
        
      } catch (error) {
        this.app.showNotification(`Failed to upload ${file.name}: ${error.message}`, 'error');
      } finally {
        this.app.hideLoading();
      }
    }
  }

  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/v1/generate/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('fenix_token') || ''}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    return response.json();
  }

  updateUploadedFilesDisplay() {
    const uploadedFilesDiv = document.getElementById('uploaded-files');
    
    if (this.uploadedFiles.length === 0) {
      uploadedFilesDiv.classList.add('hidden');
      return;
    }

    uploadedFilesDiv.classList.remove('hidden');
    uploadedFilesDiv.innerHTML = `
      <div class="uploaded-files-header">
        <strong>Uploaded Files (${this.uploadedFiles.length})</strong>
      </div>
      ${this.uploadedFiles.map(file => `
        <div class="uploaded-file-item" data-file-id="${file.id}">
          <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-details">${this.formatFileSize(file.size)} • ${this.getFileTypeIcon(file.type)}</div>
            ${file.analysis ? `<div class="file-analysis">${file.analysis}</div>` : ''}
          </div>
          <button class="btn btn-sm btn-outline remove-file-btn" onclick="generator.removeFile('${file.id}')">
            ✕
          </button>
        </div>
      `).join('')}
    `;
  }

  removeFile(fileId) {
    this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileId);
    this.updateUploadedFilesDisplay();
    this.app.showNotification('File removed', 'info');
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileTypeIcon(type) {
    if (type.includes('pdf')) return '📄 PDF';
    if (type.includes('word')) return '📝 Word';
    if (type.includes('sheet')) return '📊 Excel';
    if (type.includes('presentation')) return '📋 PowerPoint';
    if (type.includes('text')) return '📄 Text';
    if (type.includes('csv')) return '📊 CSV';
    if (type.includes('json')) return '🔧 JSON';
    return '📄 File';
  }

  async loadTemplates() {
    try {
      // Skip template loading for process improvement (they have fixed templates)
      if (this.currentType === 'process-improvement') {
        const select = document.getElementById('doc-template');
        select.innerHTML = '<option value="">Use Default Template</option>';
        return;
      }
      
      const templates = await this.api.getTemplates(this.currentType);
      const select = document.getElementById('doc-template');
      select.innerHTML = '<option value="">Default Template</option>';
      
      if (templates && templates.length > 0) {
        templates.forEach(template => {
          const option = document.createElement('option');
          option.value = template.id;
          option.textContent = template.name;
          select.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  }

  async generateDocument() {
    const title = document.getElementById('doc-title').value;
    const description = document.getElementById('doc-description').value;
    const template = document.getElementById('doc-template').value;
    const contentStr = document.getElementById('doc-content').value;

    // Handle process improvement types
    if (this.currentType === 'process-improvement') {
      if (!this.currentProcessType) {
        this.app.showNotification('Please select a process improvement tool', 'error');
        return;
      }
      
      const problemStatement = document.getElementById('problem-statement').value;
      if (!problemStatement) {
        this.app.showNotification('Problem statement is required for process improvement tools', 'error');
        return;
      }
      
      return this.generateProcessImprovement(title, problemStatement, this.currentProcessType);
    }

    let content = {};
    if (contentStr) {
      // Try to parse as JSON first
      try {
        content = JSON.parse(contentStr);
      } catch (error) {
        // Not JSON - treat as natural language and let AI handle it
        console.log('Content is natural language, AI will structure it');
        content = {
          naturalLanguage: contentStr,
          useAI: true
        };
      }
    }

    // Collect theme preferences for PowerPoint
    let themePreferences = null;
    if (this.currentType === 'powerpoint') {
      themePreferences = this.collectThemePreferences();
    }

    const data = {
      title,
      description,
      template: template || undefined,
      content: content,
      options: {},
      themePreferences,
      attachedFiles: this.uploadedFiles || []
    };

    try {
      this.app.showLoading('Generating document...');
      
      let result;
      if (this.currentType === 'powerpoint') {
        result = await this.api.generatePowerPoint(data);
      } else if (this.currentType === 'excel') {
        result = await this.api.generateExcel(data);
      } else if (this.currentType === 'word') {
        result = await this.api.generateWord(data);
      }

      // Extract the actual job data from the response
      const jobData = result.data || result;
      const jobId = jobData.id;

      if (!jobId) {
        throw new Error('No job ID returned from server');
      }

      this.showGenerationStatus(jobId);
      
      // Subscribe to WebSocket updates for this job
      this.app.ws.subscribe(jobId);
      
      // Set up WebSocket handlers for this job
      const progressHandler = (data) => {
        if (data.workflowId === jobId) {
          this.updateProgress(data.progress, data.message);
        }
      };
      
      const statusHandler = (data) => {
        if (data.workflowId === jobId) {
          this.updateStatus(data.status, data.result, data.error);
          if (data.status === 'complete' || data.status === 'failed') {
            // Clean up handlers
            this.app.ws.off('progress', progressHandler);
            this.app.ws.off('status', statusHandler);
            this.app.ws.unsubscribe(jobId);
          }
        }
      };
      
      this.app.ws.on('progress', progressHandler);
      this.app.ws.on('status', statusHandler);
      
      // Also poll as fallback
      this.pollStatus(jobId);
    } catch (error) {
      this.app.showNotification('Failed to generate document: ' + error.message, 'error');
    } finally {
      this.app.hideLoading();
    }
  }

  collectThemePreferences() {
    const themeMode = document.querySelector('input[name="theme-mode"]:checked').value;
    
    if (themeMode === 'amazon') {
      return {
        useAmazonTheme: true
      };
    } else if (themeMode === 'custom') {
      const contentType = document.getElementById('theme-content-type').value;
      const mood = document.getElementById('theme-mood').value;
      const audience = document.getElementById('theme-audience').value;
      const industry = document.getElementById('theme-industry').value;
      const colors = document.getElementById('theme-colors').value;
      
      const preferences = {
        contentType,
        mood,
        audience,
        keywords: []
      };
      
      if (industry) {
        preferences.industry = industry;
        preferences.keywords.push(industry.toLowerCase());
      }
      
      if (colors) {
        preferences.userPreferences = {
          favoriteColors: colors.split(',').map(c => c.trim())
        };
      }
      
      return preferences;
    }
    
    // Auto mode - let AI decide
    return {
      useAI: true
    };
  }

  async getThemeSuggestions() {
    const title = document.getElementById('doc-title').value;
    const content = document.getElementById('doc-content').value;
    
    if (!title && !content) {
      this.app.showNotification('Please enter a title or content to get theme suggestions', 'warning');
      return;
    }
    
    try {
      this.app.showLoading('Getting AI theme suggestions...');
      
      const response = await fetch('/api/v1/generate/theme-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.app.auth.getToken()}`
        },
        body: JSON.stringify({ title, content })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get theme suggestions');
      }
      
      const result = await response.json();
      this.displayThemeSuggestions(result.data.suggestions);
      
    } catch (error) {
      this.app.showNotification('Failed to get theme suggestions: ' + error.message, 'error');
    } finally {
      this.app.hideLoading();
    }
  }

  displayThemeSuggestions(suggestions) {
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';
    
    if (suggestions.length === 0) {
      suggestionsList.innerHTML = '<p class="text-muted">No suggestions available</p>';
      suggestionsList.classList.remove('hidden');
      return;
    }
    
    suggestions.forEach((suggestion, index) => {
      const suggestionDiv = document.createElement('div');
      suggestionDiv.className = 'theme-suggestion p-2 border rounded mb-2';
      suggestionDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <strong>${suggestion.contentType} - ${suggestion.mood}</strong>
            <div class="text-muted small">
              Audience: ${suggestion.audience} | Keywords: ${suggestion.keywords.join(', ')}
            </div>
          </div>
          <button class="btn btn-sm btn-primary" onclick="generator.applyThemeSuggestion(${index})">
            Apply
          </button>
        </div>
      `;
      suggestionsList.appendChild(suggestionDiv);
    });
    
    suggestionsList.classList.remove('hidden');
    this.currentSuggestions = suggestions;
  }

  applyThemeSuggestion(index) {
    const suggestion = this.currentSuggestions[index];
    
    // Select custom theme mode
    document.getElementById('theme-custom').checked = true;
    document.getElementById('custom-theme-options').classList.remove('hidden');
    
    // Apply suggestion values
    document.getElementById('theme-content-type').value = suggestion.contentType;
    document.getElementById('theme-mood').value = suggestion.mood;
    document.getElementById('theme-audience').value = suggestion.audience;
    
    if (suggestion.industry) {
      document.getElementById('theme-industry').value = suggestion.industry;
    }
    
    this.app.showNotification('Theme suggestion applied!', 'success');
  }

  async showThemeHistory() {
    try {
      this.app.showLoading('Loading theme history...');
      
      const response = await fetch('/api/v1/generate/theme-history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.app.auth.getToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get theme history');
      }
      
      const result = await response.json();
      this.displayThemeHistory(result.data);
      
    } catch (error) {
      this.app.showNotification('Failed to get theme history: ' + error.message, 'error');
    } finally {
      this.app.hideLoading();
    }
  }

  displayThemeHistory(themes) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    if (themes.length === 0) {
      historyList.innerHTML = '<p class="text-muted">No theme history available</p>';
      historyList.classList.remove('hidden');
      return;
    }
    
    themes.slice(0, 5).forEach(theme => {
      const themeDiv = document.createElement('div');
      themeDiv.className = 'theme-history-item p-2 border rounded mb-2';
      themeDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <strong>${theme.name}</strong>
            <div class="text-muted small">${theme.description}</div>
            <div class="theme-colors mt-1">
              <span class="color-swatch" style="background-color: ${theme.colors.primary}"></span>
              <span class="color-swatch" style="background-color: ${theme.colors.secondary}"></span>
              <span class="color-swatch" style="background-color: ${theme.colors.accent}"></span>
            </div>
            <div class="text-muted small">
              Used ${theme.usageCount} times
              ${theme.userRating ? `| Rating: ${'★'.repeat(theme.userRating)}` : ''}
            </div>
          </div>
          <div class="theme-actions">
            <button class="btn btn-sm btn-outline" onclick="generator.rateTheme('${theme.id}')">
              Rate
            </button>
          </div>
        </div>
      `;
      historyList.appendChild(themeDiv);
    });
    
    historyList.classList.remove('hidden');
  }

  async rateTheme(themeId) {
    const rating = prompt('Rate this theme (1-5 stars):');
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      return;
    }
    
    try {
      const response = await fetch('/api/v1/generate/rate-theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.app.auth.getToken()}`
        },
        body: JSON.stringify({ themeId, rating: parseInt(rating) })
      });
      
      if (!response.ok) {
        throw new Error('Failed to rate theme');
      }
      
      this.app.showNotification('Theme rated successfully!', 'success');
      this.showThemeHistory(); // Refresh the history
      
    } catch (error) {
      this.app.showNotification('Failed to rate theme: ' + error.message, 'error');
    }
  }

  async generateProcessImprovement(title, problemStatement, processType) {
    const data = {
      title,
      problemStatement,
      options: {}
    };

    try {
      this.app.showLoading(`Generating ${processType.replace('-', ' ')}...`);
      
      let result;
      if (processType === 'process-map') {
        result = await this.api.generateProcessMap(data);
      } else if (processType === 'fishbone-diagram') {
        result = await this.api.generateFishboneDiagram(data);
      } else if (processType === '5-whys') {
        result = await this.api.generateFiveWhys(data);
      }

      // Extract the actual job data from the response
      const jobData = result.data || result;
      const jobId = jobData.id;

      if (!jobId) {
        throw new Error('No job ID returned from server');
      }

      this.showGenerationStatus(jobId);
      
      // Subscribe to WebSocket updates for this job
      this.app.ws.subscribe(jobId);
      
      // Set up WebSocket handlers for this job
      const progressHandler = (data) => {
        if (data.workflowId === jobId) {
          this.updateProgress(data.progress, data.message);
        }
      };
      
      const statusHandler = (data) => {
        if (data.workflowId === jobId) {
          this.updateStatus(data.status, data.result, data.error);
          if (data.status === 'complete' || data.status === 'failed') {
            // Clean up handlers
            this.app.ws.off('progress', progressHandler);
            this.app.ws.off('status', statusHandler);
            this.app.ws.unsubscribe(jobId);
          }
        }
      };
      
      this.app.ws.on('progress', progressHandler);
      this.app.ws.on('status', statusHandler);
      
      // Also poll as fallback
      this.pollStatus(jobId);
    } catch (error) {
      this.app.showNotification('Failed to generate process improvement tool: ' + error.message, 'error');
    } finally {
      this.app.hideLoading();
    }
  }

  updateProgress(progress, message) {
    const progressBar = document.getElementById('progress-bar');
    const statusMessage = document.getElementById('status-message');
    
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
      progressBar.textContent = `${progress}%`;
    }
    
    if (statusMessage) {
      statusMessage.textContent = message;
    }
  }

  updateStatus(status, result, error) {
    const statusMessage = document.getElementById('status-message');
    const downloadSection = document.getElementById('download-section');
    
    if (status === 'complete') {
      this.app.showNotification('Document generated successfully!', 'success');
      if (result && result.downloadUrl) {
        const downloadLink = document.getElementById('download-link');
        downloadLink.href = result.downloadUrl;
        downloadSection.classList.remove('hidden');
      }
      if (statusMessage) {
        statusMessage.textContent = 'Complete!';
      }
    } else if (status === 'failed') {
      this.app.showNotification('Generation failed: ' + error, 'error');
      if (statusMessage) {
        statusMessage.textContent = 'Failed: ' + error;
      }
    } else if (statusMessage) {
      statusMessage.textContent = status;
    }
  }

  showGenerationStatus(jobId) {
    const statusCard = document.getElementById('generation-status');
    statusCard.classList.remove('hidden');
    statusCard.scrollIntoView({ behavior: 'smooth' });
  }

  async pollStatus(jobId) {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      try {
        const status = await this.api.getGenerationStatus(jobId);
        
        const progressBar = document.getElementById('progress-bar');
        const statusMessage = document.getElementById('status-message');
        const downloadSection = document.getElementById('download-section');

        progressBar.style.width = `${status.progress}%`;
        progressBar.textContent = `${status.progress}%`;
        statusMessage.textContent = status.status;

        if (status.status === 'complete') {
          this.app.showNotification('Document generated successfully!', 'success');
          const downloadLink = document.getElementById('download-link');
          downloadLink.href = this.api.getDownloadURL(jobId);
          downloadSection.classList.remove('hidden');
          return;
        }

        if (status.status === 'failed') {
          this.app.showNotification('Generation failed: ' + status.error, 'error');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        }
      } catch (error) {
        console.error('Failed to poll status:', error);
      }
    };

    poll();
  }
}
