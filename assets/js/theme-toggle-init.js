// Theme toggle initialization - runs after page loads
(function() {
    // Initialize the day/night toggle with the correct initial state
    const toggle = new DayNightToggle('#theme-toggle-container', {
        syncBody: false, // We'll handle this manually
        initialState: window.__INITIAL_THEME__,
        onToggle: (mode) => {
            // Save preference to localStorage
            localStorage.setItem('theme', mode);
            
            // Apply theme to html element (not body)
            const isDark = mode === 'dark';
            document.documentElement.setAttribute('data-dark-mode', isDark);
            
            console.log('Theme changed to:', mode);
        }
    });

    // Listen for browser preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            const newMode = e.matches ? 'dark' : 'light';
            const currentPressed = toggle.button.getAttribute('aria-pressed') === 'true';
            const shouldBeDark = newMode === 'dark';
            
            if (currentPressed !== shouldBeDark) {
                toggle.button.click();
            }
        }
    });
})();