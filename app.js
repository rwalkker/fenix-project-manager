// FENIX Project Manager JavaScript

// Global state
let currentSection = 'dashboard';
let templates = {};
let systemInfo = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 FENIX Project Manager loaded');
    
    // Set up navigation
    setupNavigation();
    
    // Load initial data
    loadSystemInfo();
    loadTemplates();
    
    // Show dashboard by default
    showSection('dashboard');
});

// Navigation setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href').substring(1);
            showSection(section);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Show specific section
function showSection(sectionName) {
    console.log(`Switching to section: ${sectionName}`);
    
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
        
        // Load section-specific data
        if (sectionName === 'templates') {
            showTemplates('powerpoint');
        } else if (sectionName === 'settings') {
            updateSystemInfo();
        }
    }
}

// Load system information
async function loadSystemInfo() {
    try {
        console.log('Loading system info...');
        const response = await fetch('/api/env');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        systemInfo = await response.json();
        console.log('System info loaded:', systemInfo);
        
        updateSystemInfo();
    } catch (error) {
        console.error('Failed to load system info:', error);
        systemInfo = {
            error: 'Failed to load system information',
            message: error.message
        };
    }
}

// Update system info display
function updateSystemInfo() {
    const systemInfoElement = document.getElementById('systemInfo');
    if (!systemInfoElement) return;
    
    let html = '';
    
    if (systemInfo.error) {
        html = `<div class="info-item">
            <span class="label">Error:</span>
            <span class="value">${systemInfo.message}</span>
        </div>`;
    } else {
        html = `
            <div class="info-item">
                <span class="label">Node Version:</span>
                <span class="value">${systemInfo.nodeVersion || 'Unknown'}</span>
            </div>
            <div class="info-item">
                <span class="label">Platform:</span>
                <span class="value">${systemInfo.platform || 'Unknown'}</span>
            </div>
            <div class="info-item">
                <span class="label">Uptime:</span>
                <span class="value">${systemInfo.uptime || 0} seconds</span>
            </div>
            <div class="info-item">
                <span class="label">Environment:</span>
                <span class="value">${systemInfo.environment?.NODE_ENV || 'production'}</span>
            </div>
            <div class="info-item">
                <span class="label">AWS Configured:</span>
                <span class="value">${systemInfo.environment?.hasAWSCredentials ? 'Yes' : 'No'}</span>
            </div>
        `;
    }
    
    systemInfoElement.innerHTML = html;
}

// Load templates
async function loadTemplates() {
    try {
        console.log('Loading templates...');
        const response = await fetch('/api/v1/templates');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        templates = data.templates || {};
        console.log('Templates loaded:', templates);
        
        // Update template dropdown in generate section
        updateTemplateDropdown();
        
    } catch (error) {
        console.error('Failed to load templates:', error);
        templates = {
            powerpoint: [{ id: 'default', name: 'Default Template', description: 'Basic template' }],
            excel: [{ id: 'default', name: 'Default Template', description: 'Basic template' }],
            word: [{ id: 'default', name: 'Default Template', description: 'Basic template' }]
        };
    }
}

// Update template dropdown
function updateTemplateDropdown() {
    const templateSelect = document.getElementById('template');
    const docTypeSelect = document.getElementById('docType');
    
    if (!templateSelect || !docTypeSelect) return;
    
    function updateOptions() {
        const docType = docTypeSelect.value;
        const templateList = templates[docType] || [];
        
        templateSelect.innerHTML = '';
        
        if (templateList.length === 0) {
            templateSelect.innerHTML = '<option value="">No templates available</option>';
        } else {
            templateList.forEach(template => {
                const option = document.createElement('option');
                option.value = template.id;
                option.textContent = template.name;
                templateSelect.appendChild(option);
            });
        }
    }
    
    // Update on document type change
    docTypeSelect.addEventListener('change', updateOptions);
    
    // Initial update
    updateOptions();
}

// Show templates for specific category
function showTemplates(category) {
    console.log(`Showing templates for: ${category}`);
    
    // Update active tab
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event?.target?.classList.add('active');
    
    const templateGrid = document.getElementById('templateGrid');
    if (!templateGrid) return;
    
    const templateList = templates[category] || [];
    
    if (templateList.length === 0) {
        templateGrid.innerHTML = '<div class="loading">No templates available for this category</div>';
        return;
    }
    
    let html = '';
    templateList.forEach(template => {
        html += `
            <div class="template-card">
                <h4>${template.name}</h4>
                <p>${template.description}</p>
                <button class="btn btn-primary" onclick="selectTemplate('${category}', '${template.id}')">
                    Use Template
                </button>
            </div>
        `;
    });
    
    templateGrid.innerHTML = html;
}

// Select template
function selectTemplate(category, templateId) {
    console.log(`Selected template: ${category}/${templateId}`);
    
    // Switch to generate section
    showSection('generate');
    
    // Update form
    const docTypeSelect = document.getElementById('docType');
    const templateSelect = document.getElementById('template');
    
    if (docTypeSelect) docTypeSelect.value = category;
    if (templateSelect) templateSelect.value = templateId;
    
    // Update nav
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('a[href="#generate"]')?.classList.add('active');
}

// Generate document
async function generateDocument() {
    const generateBtn = document.getElementById('generateBtn');
    const spinner = generateBtn.querySelector('.btn-spinner');
    const resultArea = document.getElementById('generationResult');
    const resultContent = document.getElementById('resultContent');
    
    // Get form data
    const docType = document.getElementById('docType').value;
    const template = document.getElementById('template').value;
    const content = document.getElementById('content').value;
    
    if (!content.trim()) {
        alert('Please enter content description');
        return;
    }
    
    // Show loading state
    generateBtn.disabled = true;
    if (spinner) spinner.style.display = 'inline';
    if (resultArea) resultArea.style.display = 'none';
    
    try {
        console.log(`Generating ${docType} document...`);
        
        const response = await fetch(`/api/v1/generate/${docType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                template: template,
                content: content,
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Generation result:', result);
        
        // Check if we have a job ID (expected format)
        if (result.success && result.jobId) {
            // New format with job ID
            if (resultContent) {
                resultContent.innerHTML = `
                    <div class="result-success">
                        <h4>✅ ${result.message}</h4>
                        <div class="result-details">
                            <p><strong>Job ID:</strong> ${result.jobId}</p>
                            <p><strong>Status:</strong> ${result.status}</p>
                            <p><strong>Filename:</strong> ${result.data?.filename || 'Unknown'}</p>
                            <p><strong>File Size:</strong> ${result.data?.fileSize || 'Unknown'}</p>
                            <p><strong>Processing Time:</strong> ${result.data?.duration || 'Unknown'}</p>
                            <p><strong>Generated:</strong> ${result.data?.generatedAt || 'Unknown'}</p>
                            ${result.data?.downloadUrl ? `<p><strong>Download:</strong> <a href="${result.data.downloadUrl}" target="_blank">Download File</a></p>` : ''}
                        </div>
                        <div class="generation-stats">
                            ${result.data?.slides ? `<span class="stat">📄 ${result.data.slides} slides</span>` : ''}
                            ${result.data?.sheets ? `<span class="stat">📊 ${result.data.sheets} sheets</span>` : ''}
                            ${result.data?.pages ? `<span class="stat">📝 ${result.data.pages} pages</span>` : ''}
                            ${result.data?.wordCount ? `<span class="stat">📝 ${result.data.wordCount} words</span>` : ''}
                        </div>
                    </div>
                `;
            }
        } else if (result.success) {
            // Legacy format without job ID
            if (resultContent) {
                resultContent.innerHTML = `
                    <div class="result-success">
                        <h4>✅ ${result.message}</h4>
                        <div class="result-details">
                            <p><strong>Filename:</strong> ${result.data?.filename || 'Unknown'}</p>
                            <p><strong>Generated:</strong> ${result.data?.generatedAt || 'Unknown'}</p>
                            ${result.note ? `<p><em>${result.note}</em></p>` : ''}
                        </div>
                    </div>
                `;
            }
        } else {
            throw new Error(result.message || result.error || 'Generation failed');
        }
        
        if (resultArea) resultArea.style.display = 'block';
        
    } catch (error) {
        console.error('Generation failed:', error);
        
        if (resultContent) {
            resultContent.innerHTML = `
                <div class="result-error">
                    <h4>❌ Generation Failed</h4>
                    <p>${error.message}</p>
                    <p><em>Please check the console for more details or try again.</em></p>
                </div>
            `;
        }
        if (resultArea) resultArea.style.display = 'block';
        
        // Show user-friendly error
        handleApiError(error, 'Document Generation');
    } finally {
        // Reset loading state
        generateBtn.disabled = false;
        if (spinner) spinner.style.display = 'none';
    }
}

// Utility functions
function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

// Error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
});

// API error handling
function handleApiError(error, context) {
    console.error(`API Error in ${context}:`, error);
    
    // Show user-friendly error message
    const errorMsg = error.message || 'An unexpected error occurred';
    
    // You could show a toast notification here
    console.log(`Error: ${errorMsg}`);
}

console.log('✅ FENIX JavaScript loaded successfully');