// ===== Hash Router for Screen Navigation =====

import { appState } from './data.js';
import { renderHome } from './screens/home.js';
import { renderTopic } from './screens/topic.js';
import { renderWords } from './screens/words.js';
import { renderRepeat } from './screens/repeat.js';
import { renderFillWords } from './screens/fillWords.js';
import { renderTest } from './screens/test.js';

function getAppContainer() {
  const app = document.getElementById('app');

  if (!app) {
    throw new Error('App container #app not found');
  }

  return app;
}

function clearApp() {
  getAppContainer().innerHTML = '';
}

function normalizeHash(hash = window.location.hash) {
  const cleaned = hash.replace(/^#/, '').trim();
  return cleaned || '/';
}

function getSegments(hash = window.location.hash) {
  return normalizeHash(hash)
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean);
}

function buildHash(screenName, params = {}) {
  const topicId = params.topicId ? String(params.topicId) : null;

  switch (screenName) {
    case 'home':
      return '#/';
    case 'topic':
      return topicId ? `#/topic/${topicId}` : '#/';
    case 'words':
      return topicId ? `#/topic/${topicId}/words` : '#/';
    case 'repeat':
      return topicId ? `#/topic/${topicId}/repeat` : '#/';
    case 'fillWords':
      return topicId ? `#/topic/${topicId}/fill-words` : '#/';
    case 'test':
      return topicId ? `#/topic/${topicId}/test` : '#/';
    default:
      return '#/';
  }
}

function resolveRoute(hash = window.location.hash) {
  const segments = getSegments(hash);

  if (segments.length === 0) {
    return { screen: 'home', params: {} };
  }

  if (segments[0] !== 'topic' || !segments[1]) {
    return { screen: 'home', params: {}, invalid: true };
  }

  const topicId = Number(segments[1]);
  if (Number.isNaN(topicId)) {
    return { screen: 'home', params: {}, invalid: true };
  }

  if (segments.length === 2) {
    return { screen: 'topic', params: { topicId } };
  }

  switch (segments[2]) {
    case 'words':
      return { screen: 'words', params: { topicId } };
    case 'repeat':
      return { screen: 'repeat', params: { topicId } };
    case 'fill-words':
      return { screen: 'fillWords', params: { topicId } };
    case 'test':
      return { screen: 'test', params: { topicId } };
    default:
      return { screen: 'home', params: {}, invalid: true };
  }
}

function renderScreen(screenName, params = {}) {
  appState.currentScreen = screenName;
  clearApp();

  switch (screenName) {
    case 'home':
      renderHome();
      break;
    case 'topic':
      renderTopic(params.topicId);
      break;
    case 'words':
      renderWords(params.topicId);
      break;
    case 'repeat':
      renderRepeat(params.topicId);
      break;
    case 'fillWords':
      renderFillWords(params.topicId);
      break;
    case 'test':
      renderTest(params.topicId);
      break;
    default:
      renderHome();
  }

  window.scrollTo(0, 0);
}

export function navigate(screenName, params = {}, options = {}) {
  const { replace = false } = options;
  const nextHash = buildHash(screenName, params);

  if (replace) {
    history.replaceState(null, '', nextHash);
    renderCurrentRoute();
    return;
  }

  if (window.location.hash === nextHash) {
    renderCurrentRoute();
    return;
  }

  window.location.hash = nextHash;
}

export function goBack() {
  if (window.history.length > 1 && normalizeHash() !== '/') {
    window.history.back();
    return;
  }

  navigate('home', {}, { replace: true });
}

export function goHome() {
  navigate('home');
}

export function renderCurrentRoute() {
  const route = resolveRoute();

  if (route.invalid) {
    navigate('home', {}, { replace: true });
    return;
  }

  renderScreen(route.screen, route.params);
}

export function initRouter() {
  window.addEventListener('hashchange', renderCurrentRoute);

  if (!window.location.hash) {
    navigate('home', {}, { replace: true });
    return;
  }

  renderCurrentRoute();
}
