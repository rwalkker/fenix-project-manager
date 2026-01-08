// FENIX Project Manager - Main Application
// Handles page routing and application state

import { API } from './api.js';
import { WebSocketClient } from './websocket.js';
import { Dashboard } from './pages/dashboard.js';
import { Generator } from './pages/generator.js';
import { Workflows } from './pages/workflows.js';
import { Templates } from './pages/templates.js';
import { Documents } from './pages/documents.js';
import { AITools } from './pages/ai-tools.js';
import { Settings } from './pages/settings.js';

class App {
  constructor() {
    this.api = new API();
    this.ws = new WebSocketClient();
    this.currentPage = null;
    this.user = null;
    this.pages = {
      dashboard: Dashboard,
      generator: Generator,
      workflows: Workflows,
      templates: Templates,
      documents: Documents,
      'ai-tools': AITools,
      settings: Settings,
    };
  }

  async init() {
    console.log('FENIX App initializing...');
    
    // Check authentication
    try {
      await this.checkAuth();
      console.log('Auth check completed, user:', this.user);
    } catch (error) {
      console.error('Auth check failed:', error);
    }
    
    try {
      this.setupNavigation();
      console.log('Navigation setup completed');
    } catch (error) {
      console.error('Navigation setup failed:', error);
    }
    
    try {
      // Skip WebSocket for now to test if it's causing issues
      // this.setupWebSocket();
      console.log('WebSocket setup skipped for debugging');
    } catch (error) {
      console.error('WebSocket setup failed:', error);
    }
    
    try {
      await this.loadPage('dashboard');
      console.log('Dashboard loaded');
    } catch (error) {
      console.error('Dashboard load failed:', error);
    }
    
    console.log('FENIX App initialization completed');
  }

  async checkAuth() {
    const token = localStorage.getItem('fenix_token');
    const userStr = localStorage.getItem('fenix_user');

    if (token && userStr) {
      try {
        // Verify token is still valid
        this.user = JSON.parse(userStr);
        // Skip API call for now to avoid authentication issues
        // const currentUser = await this.api.getCurrentUser();
        // this.user = currentUser;
        
        // Update navbar with user info
        this.updateNavbar();
        return;
      } catch (error) {
        // Token invalid, clear it and continue as public user
        console.log('Token invalid, continuing as public user');
        localStorage.removeItem('fenix_token');
        localStorage.removeItem('fenix_user');
      }
    }

    // No authentication or invalid token - continue as public user
    this.user = {
      userId: 'public-user',
      username: 'Public User',
      role: 'user'
    };
    
    // Update navbar for public access
    this.updateNavbar();
  }

  updateNavbar() {
    const navbar = document.querySelector('.navbar-container');
    if (navbar) {
      // Remove existing user info
      const existingUserInfo = navbar.querySelector('.navbar-user');
      if (existingUserInfo) {
        existingUserInfo.remove();
      }

      const userInfo = document.createElement('div');
      userInfo.className = 'navbar-user';
      
      if (this.user && this.user.userId !== 'public-user') {
        // Authenticated user - show user info and logout
        userInfo.innerHTML = `
          <span style="color: white; margin-right: 10px;">${this.user.username} (${this.user.role})</span>
          <button id="logout-btn" style="background: var(--primary); color: var(--secondary); border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer;">Logout</button>
        `;
        
        navbar.appendChild(userInfo);

        document.getElementById('logout-btn').addEventListener('click', async () => {
          await this.api.logout();
          // Clear auth and reload as public user
          localStorage.removeItem('fenix_token');
          localStorage.removeItem('fenix_user');
          window.location.reload();
        });
      } else {
        // Public user - show admin sign-in button
        userInfo.innerHTML = `
          <span style="color: white; margin-right: 10px;">Public Access</span>
          <button id="admin-signin-btn" style="background: var(--primary); color: var(--secondary); border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer;">Admin Sign In</button>
        `;
        
        navbar.appendChild(userInfo);

        document.getElementById('admin-signin-btn').addEventListener('click', () => {
          this.showAdminSignIn();
        });
      }
    }
  }

  setupWebSocket() {
    // Connect to WebSocket server
    this.ws.connect();

    // Set up global notification handler
    this.ws.on('notification', (data) => {
      this.showNotification(data.message, data.level);
    });

    // Set up progress handler
    this.ws.on('progress', (data) => {
      console.log('Progress update:', data);
      // Progress updates are handled by individual pages
    });

    // Set up status handler
    this.ws.on('status', (data) => {
      console.log('Status update:', data);
      // Status updates are handled by individual pages
    });
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.navbar-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        this.loadPage(page);
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  async loadPage(pageName) {
    const content = document.getElementById('content');
    const PageClass = this.pages[pageName];

    if (!PageClass) {
      content.innerHTML = '<h1>Page not found</h1>';
      return;
    }

    try {
      this.showLoading();
      this.currentPage = new PageClass(this.api, this);
      await this.currentPage.render(content);
    } catch (error) {
      console.error('Error loading page:', error);
      this.showNotification('Failed to load page', 'error');
    } finally {
      this.hideLoading();
    }
  }

  showLoading(message = 'Processing...') {
    const overlay = document.getElementById('loading-overlay');
    const text = overlay.querySelector('.loading-text');
    text.textContent = message;
    overlay.classList.remove('hidden');
  }

  hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    overlay.classList.add('hidden');
  }

  showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  showAdminSignIn() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'admin-signin-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'admin-signin-modal';
    modal.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 90%;
    `;

    modal.innerHTML = `
      <h2 style="margin-bottom: 20px; color: var(--secondary);">Admin Sign In</h2>
      <div id="admin-error" style="color: red; margin-bottom: 15px; display: none;"></div>
      <form id="admin-signin-form">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Username</label>
          <input type="text" id="admin-username" value="Admin" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" required>
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Password</label>
          <input type="password" id="admin-password" placeholder="PHX6!2026" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" required>
        </div>
        <div style="display: flex; gap: 10px;">
          <button type="submit" style="flex: 1; padding: 12px; background: var(--primary); color: var(--secondary); border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Sign In</button>
          <button type="button" id="admin-cancel" style="flex: 1; padding: 12px; background: #ccc; color: #333; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
        </div>
      </form>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Handle form submission
    const form = modal.querySelector('#admin-signin-form');
    const errorDiv = modal.querySelector('#admin-error');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = modal.querySelector('#admin-username').value;
      const password = modal.querySelector('#admin-password').value;

      try {
        const response = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Login failed');
        }

        const data = await response.json();
        
        // Store token and user info
        localStorage.setItem('fenix_token', data.token);
        localStorage.setItem('fenix_user', JSON.stringify(data.user));
        
        // Close modal and reload
        document.body.removeChild(overlay);
        window.location.reload();
        
      } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
      }
    });

    // Handle cancel
    modal.querySelector('#admin-cancel').addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    // Handle overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
  
  // Make app globally available
  window.fenixApp = app;
});
