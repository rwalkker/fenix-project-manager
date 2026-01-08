// FENIX Project Manager - AI Tools Page

export class AITools {
  constructor(api, app) {
    this.api = api;
    this.app = app;
  }

  async render(container) {
    container.innerHTML = `
      <div class="ai-tools">
        <h1 class="mb-3">AI Tools</h1>

        <div class="grid grid-2">
          <div class="card">
            <div class="card-header">Document Summarization</div>
            <div class="card-body">
              <textarea class="form-textarea mb-2" id="summarize-input" 
                        placeholder="Paste document text here..."></textarea>
              <button class="btn btn-primary" id="summarize-btn">Summarize</button>
              <div id="summarize-result" class="mt-2 hidden"></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">Key Point Extraction</div>
            <div class="card-body">
              <textarea class="form-textarea mb-2" id="extract-input" 
                        placeholder="Paste document text here..."></textarea>
              <button class="btn btn-primary" id="extract-btn">Extract Points</button>
              <div id="extract-result" class="mt-2 hidden"></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">Sentiment Analysis</div>
            <div class="card-body">
              <textarea class="form-textarea mb-2" id="sentiment-input" 
                        placeholder="Paste text here..."></textarea>
              <button class="btn btn-primary" id="sentiment-btn">Analyze</button>
              <div id="sentiment-result" class="mt-2 hidden"></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">Readability Check</div>
            <div class="card-body">
              <textarea class="form-textarea mb-2" id="readability-input" 
                        placeholder="Paste text here..."></textarea>
              <button class="btn btn-primary" id="readability-btn">Check</button>
              <div id="readability-result" class="mt-2 hidden"></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">Compliance Checker</div>
            <div class="card-body">
              <textarea class="form-textarea mb-2" id="compliance-input" 
                        placeholder="Paste document text here..."></textarea>
              <select class="form-select mb-2" id="compliance-type">
                <option value="gdpr">GDPR</option>
                <option value="hipaa">HIPAA</option>
                <option value="sox">SOX</option>
              </select>
              <button class="btn btn-primary" id="compliance-btn">Check Compliance</button>
              <div id="compliance-result" class="mt-2 hidden"></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">Format Recommender</div>
            <div class="card-body">
              <textarea class="form-textarea mb-2" id="format-input" 
                        placeholder="Describe your content..."></textarea>
              <button class="btn btn-primary" id="format-btn">Get Recommendation</button>
              <div id="format-result" class="mt-2 hidden"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('summarize-btn').addEventListener('click', () => this.summarize());
    document.getElementById('extract-btn').addEventListener('click', () => this.extractPoints());
    document.getElementById('sentiment-btn').addEventListener('click', () => this.analyzeSentiment());
    document.getElementById('readability-btn').addEventListener('click', () => this.checkReadability());
    document.getElementById('compliance-btn').addEventListener('click', () => this.checkCompliance());
    document.getElementById('format-btn').addEventListener('click', () => this.recommendFormat());
  }

  async summarize() {
    const text = document.getElementById('summarize-input').value;
    if (!text) return;

    try {
      this.app.showLoading('Summarizing...');
      const result = await this.api.summarizeDocument({ text, length: 150, format: 'bullets' });
      document.getElementById('summarize-result').innerHTML = `<strong>Summary:</strong><br>${result.summary}`;
      document.getElementById('summarize-result').classList.remove('hidden');
      this.app.showNotification('Summarization complete', 'success');
    } catch (error) {
      this.app.showNotification('Failed to summarize: ' + error.message, 'error');
    } finally {
      this.app.hideLoading();
    }
  }

  async extractPoints() {
    const text = document.getElementById('extract-input').value;
    if (!text) return;

    try {
      this.app.showLoading('Extracting key points...');
      const result = await this.api.extractKeyPoints({ text, maxPoints: 5 });
      const points = result.points.map(p => `<li>${p}</li>`).join('');
      document.getElementById('extract-result').innerHTML = `<strong>Key Points:</strong><ul>${points}</ul>`;
      document.getElementById('extract-result').classList.remove('hidden');
      this.app.showNotification('Extraction complete', 'success');
    } catch (error) {
      this.app.showNotification('Failed to extract: ' + error.message, 'error');
    } finally {
      this.app.hideLoading();
    }
  }

  async analyzeSentiment() {
    const text = document.getElementById('sentiment-input').value;
    if (!text) return;

    try {
      this.app.showLoading('Analyzing sentiment...');
      const result = await this.api.analyzeSentiment({ text });
      document.getElementById('sentiment-result').innerHTML = `
        <strong>Sentiment:</strong> ${result.sentiment}<br>
        <strong>Score:</strong> ${result.score}
      `;
      document.getElementById('sentiment-result').classList.remove('hidden');
      this.app.showNotification('Analysis complete', 'success');
    } catch (error) {
      this.app.showNotification('Failed to analyze: ' + error.message, 'error');
    } finally {
      this.app.hideLoading();
    }
  }

  async checkReadability() {
    const text = document.getElementById('readability-input').value;
    if (!text) return;

    try {
      this.app.showLoading('Checking readability...');
      const result = await this.api.checkReadability({ text });
      document.getElementById('readability-result').innerHTML = `
        <strong>Grade Level:</strong> ${result.gradeLevel}<br>
        <strong>Score:</strong> ${result.score}
      `;
      document.getElementById('readability-result').classList.remove('hidden');
      this.app.showNotification('Check complete', 'success');
    } catch (error) {
      this.app.showNotification('Failed to check: ' + error.message, 'error');
    } finally {
      this.app.hideLoading();
    }
  }

  async checkCompliance() {
    const text = document.getElementById('compliance-input').value;
    const type = document.getElementById('compliance-type').value;
    if (!text) return;

    try {
      this.app.showLoading('Checking compliance...');
      const result = await this.api.checkCompliance({ text, standard: type });
      const issues = result.issues.map(i => `<li>${i}</li>`).join('');
      document.getElementById('compliance-result').innerHTML = `
        <strong>Compliant:</strong> ${result.compliant ? 'Yes' : 'No'}<br>
        ${issues ? `<strong>Issues:</strong><ul>${issues}</ul>` : ''}
      `;
      document.getElementById('compliance-result').classList.remove('hidden');
      this.app.showNotification('Check complete', 'success');
    } catch (error) {
      this.app.showNotification('Failed to check: ' + error.message, 'error');
    } finally {
      this.app.hideLoading();
    }
  }

  async recommendFormat() {
    const description = document.getElementById('format-input').value;
    if (!description) return;

    try {
      this.app.showLoading('Getting recommendation...');
      const result = await this.api.recommendFormat({ description });
      document.getElementById('format-result').innerHTML = `
        <strong>Recommended Format:</strong> ${result.format}<br>
        <strong>Reason:</strong> ${result.reason}
      `;
      document.getElementById('format-result').classList.remove('hidden');
      this.app.showNotification('Recommendation ready', 'success');
    } catch (error) {
      this.app.showNotification('Failed to get recommendation: ' + error.message, 'error');
    } finally {
      this.app.hideLoading();
    }
  }
}
