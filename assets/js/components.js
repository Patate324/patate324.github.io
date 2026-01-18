// Component loader - loads header and footer
(function() {
    // Function to load HTML component
    async function loadComponent(elementId, componentPath) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
            const html = await response.text();
            document.getElementById(elementId).innerHTML = html;
        } catch (error) {
            console.error('Error loading component:', error);
        }
    }

    // Function to initialize everything after components are loaded
    function initializeComponents() {
        // Set active navigation link
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('nav a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.setAttribute('aria-current', 'page');
            }
        });

        // Initialize theme toggles
        initializeThemeToggles();
        
        // Initialize mobile menu
        initializeMobileMenu();
    }

    // Theme toggle initialization
    function initializeThemeToggles() {
        // Desktop theme toggle
        new DayNightToggle('#theme-toggle-container', {
            syncBody: false,
            initialState: window.__INITIAL_THEME__,
            onToggle: (mode) => {
                localStorage.setItem('theme', mode);
                const isDark = mode === 'dark';
                document.documentElement.setAttribute('data-dark-mode', isDark);
            }
        });

        // Mobile theme toggle (only initialize if on mobile)
        if (window.innerWidth <= 768) {
            new DayNightToggle('#theme-toggle-container-mobile', {
                syncBody: false,
                initialState: window.__INITIAL_THEME__,
                onToggle: (mode) => {
                    localStorage.setItem('theme', mode);
                    const isDark = mode === 'dark';
                    document.documentElement.setAttribute('data-dark-mode', isDark);
                }
            });
        }

        // Listen for browser preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newMode = e.matches ? 'dark' : 'light';
                const isDark = newMode === 'dark';
                document.documentElement.setAttribute('data-dark-mode', isDark);
            }
        });
    }

    // Mobile menu initialization
    function initializeMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileOverlay = document.querySelector('.mobile-menu-overlay');
        
        if (!hamburger || !mobileMenu || !mobileOverlay) return;

        function openMenu() {
            hamburger.classList.add('active');
            mobileMenu.classList.add('active');
            mobileOverlay.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        
        function closeMenu() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        
        // Only the hamburger button opens/closes the menu
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            if (hamburger.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Clicking the overlay closes the menu
        mobileOverlay.addEventListener('click', function(e) {
            e.stopPropagation();
            closeMenu();
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) {
                    closeMenu();
                }
            });
        });
    }

    // Load components when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            await Promise.all([
                loadComponent('header-placeholder', '../assets/components/header.html'),
                loadComponent('footer-placeholder', '../assets/components/footer.html')
            ]);
            initializeComponents();
        });
    } else {
        (async () => {
            await Promise.all([
                loadComponent('header-placeholder', '../assets/components/header.html'),
                loadComponent('footer-placeholder', '../assets/components/footer.html')
            ]);
            initializeComponents();
        })();
    }
})();