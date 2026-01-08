// FENIX Project Manager - Preview Component
// Document preview UI component

export class PreviewComponent {
  constructor(api) {
    this.api = api;
  }

  /**
   * Render PowerPoint preview
   */
  renderPowerPointPreview(preview) {
    const { metadata, slides } = preview;

    return `
      <div class="preview-container">
        <div class="preview-header">
          <h2>${metadata.filename}</h2>
          <p>${metadata.pageCount} slides | ${this.formatFileSize(metadata.fileSize)}</p>
        </div>

        <div class="preview-slides">
          ${slides.map(slide => `
            <div class="slide-preview">
              <div class="slide-number">Slide ${slide.slideNumber}</div>
              <div class="slide-title">${slide.title || 'Untitled'}</div>
              <div class="slide-content">${slide.content}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render Excel preview
   */
  renderExcelPreview(preview) {
    const { metadata, sheets } = preview;

    return `
      <div class="preview-container">
        <div class="preview-header">
          <h2>${metadata.filename}</h2>
          <p>${metadata.pageCount} sheets | ${this.formatFileSize(metadata.fileSize)}</p>
        </div>

        <div class="preview-tabs">
          ${sheets.map((sheet, index) => `
            <button class="tab-btn ${index === 0 ? 'active' : ''}" data-sheet="${index}">
              ${sheet.sheetName}
            </button>
          `).join('')}
        </div>

        <div class="preview-sheets">
          ${sheets.map((sheet, index) => `
            <div class="sheet-preview ${index === 0 ? 'active' : ''}" data-sheet="${index}">
              <div class="sheet-info">
                ${sheet.rowCount} rows × ${sheet.columnCount} columns
              </div>
              <div class="sheet-table-container">
                <table class="sheet-table">
                  ${this.renderExcelTable(sheet)}
                </table>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render Excel table
   */
  renderExcelTable(sheet) {
    if (!sheet.data || sheet.data.length === 0) {
      return '<tr><td>No data</td></tr>';
    }

    return sheet.data.map((row, rowIndex) => `
      <tr>
        ${row.map((cell) => {
          const tag = rowIndex === 0 ? 'th' : 'td';
          return `<${tag}>${this.formatCellValue(cell)}</${tag}>`;
        }).join('')}
      </tr>
    `).join('');
  }

  /**
   * Render Word preview
   */
  renderWordPreview(preview) {
    const { metadata, preview: wordPreview } = preview;

    return `
      <div class="preview-container">
        <div class="preview-header">
          <h2>${metadata.filename}</h2>
          <p>${this.formatFileSize(metadata.fileSize)}</p>
        </div>

        <div class="preview-document">
          ${wordPreview.sections.map(section => {
            if (section.type === 'heading') {
              return `<h${section.level || 1}>${section.content}</h${section.level || 1}>`;
            } else if (section.type === 'paragraph') {
              return `<p>${section.content}</p>`;
            } else if (section.type === 'list') {
              return `<li>${section.content}</li>`;
            }
            return '';
          }).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Format file size
   */
  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /**
   * Format cell value
   */
  formatCellValue(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  /**
   * Setup tab switching for Excel preview
   */
  setupTabSwitching(container) {
    const tabBtns = container.querySelectorAll('.tab-btn');
    const sheets = container.querySelectorAll('.sheet-preview');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const sheetIndex = btn.getAttribute('data-sheet');

        // Update active tab
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active sheet
        sheets.forEach(s => s.classList.remove('active'));
        const targetSheet = container.querySelector(`.sheet-preview[data-sheet="${sheetIndex}"]`);
        if (targetSheet) {
          targetSheet.classList.add('active');
        }
      });
    });
  }

  /**
   * Show preview modal
   */
  async showPreview(documentId, container) {
    try {
      // Fetch preview data from API
      const response = await fetch(`/api/v1/preview/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load preview: ${response.statusText}`);
      }

      const previewData = await response.json();

      // Create modal
      const modal = document.createElement('div');
      modal.className = 'preview-modal';
      modal.innerHTML = `
        <div class="preview-modal-content">
          <div class="preview-header">
            <h2>Document Preview</h2>
            <button class="preview-close">&times;</button>
          </div>
          <div class="preview-content"></div>
          <div class="preview-footer">
            <button class="btn btn-primary" onclick="window.location.href='/api/v1/generate/download/${documentId}'">
              Download
            </button>
          </div>
        </div>
      `;

      container.appendChild(modal);

      // Render preview based on type
      const content = modal.querySelector('.preview-content');
      if (previewData.metadata.type === 'powerpoint') {
        content.innerHTML = this.renderPowerPointPreview(previewData);
      } else if (previewData.metadata.type === 'excel') {
        content.innerHTML = this.renderExcelPreview(previewData);
        this.setupTabSwitching(content);
      } else if (previewData.metadata.type === 'word') {
        content.innerHTML = this.renderWordPreview(previewData);
      }

      // Close handlers
      modal.querySelector('.preview-close').addEventListener('click', () => {
        modal.remove();
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });

    } catch (error) {
      console.error('Preview error:', error);
      throw error;
    }
  }
}
