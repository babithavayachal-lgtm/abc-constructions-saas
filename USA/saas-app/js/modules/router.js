/* =========================================
   ABC Constructions — Router Module
   Simple client-side router for SPA navigation
   ========================================= */

const Router = {
  routes: {},

  init() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      const path = window.location.pathname;
      const page = path.replace('/', '') || 'dashboard';
      App.navigateTo(page);
    });
  },

  navigate(page) {
    history.pushState(null, null, `/${page}`);
    App.navigateTo(page);
  },
};
