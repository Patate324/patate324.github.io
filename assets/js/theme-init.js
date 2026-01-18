// Theme initialization - must run in <head> to prevent flash
(function() {
    // Detect browser preference for dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    
    // Determine initial theme
    let initialTheme = 'dark'; // default
    if (savedTheme) {
        initialTheme = savedTheme;
    } else if (!prefersDarkMode) {
        initialTheme = 'light';
    }
    
    // Apply theme immediately to prevent flash
    if (initialTheme === 'light') {
        document.documentElement.setAttribute('data-dark-mode', 'false');
    } else {
        document.documentElement.setAttribute('data-dark-mode', 'true');
    }
    
    // Store for later use
    window.__INITIAL_THEME__ = initialTheme;
})();