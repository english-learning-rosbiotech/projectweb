// ===== Main App Entry Point =====

import { initRouter } from './router.js';
import { initTheme, toggleTheme } from './data.js';

function createThemeToggle() {
  const existingToggle = document.querySelector('.theme-toggle');
  if (existingToggle) {
    existingToggle.remove();
  }

  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Переключить тему');

  const syncToggleIcon = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.textContent = isDark ? '☀️' : '🌙';
  };

  toggle.addEventListener('click', () => {
    const isDark = toggleTheme();
    syncToggleIcon();
    updateLogoForTheme(isDark);
  });

  syncToggleIcon();
  document.body.appendChild(toggle);
}

function updateLogoForTheme(isDark) {
  const logo = document.querySelector('.welcome__logo-img');
  if (logo) {
    logo.src = isDark ? 'assets/images/logo-dark.png' : 'assets/images/logo-light.png';
  }
}

function init() {
  console.log('English Learning Web App - Initializing...');

  initTheme();
  initRouter();
  createThemeToggle();

  document.addEventListener('visibilitychange', () => {
    console.log(document.hidden ? 'App paused' : 'App resumed');
  });

  window.addEventListener('beforeunload', () => {
    console.log('App closing');
  });

  console.log('App initialized successfully');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
