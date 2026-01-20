/*
*   Website Design & Development Disclosure
*   ========================================
*   This website was created with the assistance of Claude AI (Anthropic) and Copilot AI (Microsoft).
*   AI was used for: code generation, design layout, translation, and content structuring.
*   
*   Final review, content, content editing, and customization was performed by the site owner.
*/

/*
 * THEME INITIALIZATION - PREVENTS FLASH OF WRONG THEME
 * =====================================================
 * 
 * WHY THIS RUNS IN <HEAD>:
 * This script MUST run before the page renders to prevent the "flash of wrong theme"
 * where the page briefly shows in light mode before switching to dark mode.
 * 
 * Include in HTML <head> BEFORE any CSS:
 * <head>
 *     <script src="/assets/js/theme-init.js"></script>
 *     <link rel="stylesheet" href="/assets/css/theme.css">
 * </head>
 * 
 * HOW IT WORKS:
 * 1. Check if user has saved theme preference (localStorage)
 * 2. If not, check browser/OS preference (prefers-color-scheme)
 * 3. Apply theme immediately before page renders
 * 4. Store theme for later use by components.js
 * 
 * THEME PRIORITY:
 * 1. User's saved preference (localStorage.theme)
 * 2. Browser/OS preference (prefers-color-scheme: dark)
 * 3. Default to dark mode
 */

(function() {
    // Detect browser/OS theme preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check for saved user preference
    const savedTheme = localStorage.getItem('theme');
    
    // Determine initial theme
    let initialTheme = 'dark'; // Default
    
    if (savedTheme) {
        initialTheme = savedTheme;
    } else if (!prefersDarkMode) {
        initialTheme = 'light';
    }
    
    // Apply theme immediately to <html> element
    if (initialTheme === 'light') {
        document.documentElement.setAttribute('data-dark-mode', 'false');
    } else {
        document.documentElement.setAttribute('data-dark-mode', 'true');
    }
    
    // Store for later use by components.js
    window.__INITIAL_THEME__ = initialTheme;
})();