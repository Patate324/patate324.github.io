// Component loader - loads header and footer
(function() {
    // Translation data
    const translations = {
        en: {
            nav: [
                { href: 'home.html', title: 'Go to homepage', text: 'Home' },
                { href: 'about.html', title: 'Learn more about me', text: 'About Me' },
                { href: 'publications.html', title: 'View my research and publications', text: 'Publications' },
                { href: 'blog.html', title: 'Read my blog posts', text: 'Blog' },
                { href: 'contacts.html', title: 'Get in touch', text: 'Contact' }
            ],
            langToggle: {
                text: 'Français',
                title: 'Passer au français',
                href: '../fr/'
            }
        },
        fr: {
            nav: [
                { href: 'home.html', title: "Page d'accueil", text: 'Accueil' },
                { href: 'about.html', title: 'À propos', text: 'À Propos' },
                { href: 'publications.html', title: 'Recherche et publications', text: 'Publications' },
                { href: 'blog.html', title: 'Lire mes articles de Blog', text: 'Blog' },
                { href: 'contacts.html', title: 'Contacter', text: 'Contact' }
            ],
            langToggle: {
                text: 'English',
                title: 'Switch to English',
                href: '../en/'
            }
        }
    };

    // Detect current language from URL
    function detectLanguage() {
        const path = window.location.pathname;
        if (path.includes('/fr/')) return 'fr';
        if (path.includes('/en/')) return 'en';
        return 'en'; // default
    }

    const currentLang = detectLanguage();

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

    // Function to populate navigation links
    function populateNavigation() {
        const navData = translations[currentLang].nav;
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Desktop navigation
        const navLinks = document.getElementById('nav-links');
        if (navLinks) {
            navLinks.innerHTML = navData.map(item => `
                <li><a href="${item.href}" title="${item.title}"${item.href === currentPage ? ' aria-current="page"' : ''}>${item.text}</a></li>
            `).join('');
        }
        
        // Mobile navigation
        const mobileNavLinks = document.getElementById('mobile-nav-links');
        if (mobileNavLinks) {
            mobileNavLinks.innerHTML = navData.map(item => `
                <li><a href="${item.href}" title="${item.title}"${item.href === currentPage ? ' aria-current="page"' : ''}>${item.text}</a></li>
            `).join('');
        }
    }

    // Function to set up language toggle
    function setupLanguageToggle() {
        const langData = translations[currentLang].langToggle;
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Desktop language toggle
        const langToggle = document.getElementById('language-toggle');
        const langText = document.getElementById('language-text');
        if (langToggle && langText) {
            langToggle.href = langData.href + currentPage;
            langToggle.title = langData.title;
            langText.textContent = langData.text;
        }
        
        // Mobile language toggle
        const mobileLangToggle = document.getElementById('mobile-language-toggle');
        const mobileLangText = document.getElementById('mobile-language-text');
        if (mobileLangToggle && mobileLangText) {
            mobileLangToggle.href = langData.href + currentPage;
            mobileLangToggle.title = langData.title;
            mobileLangText.textContent = langData.text;
        }
    }

    // Function to translate static content
    function translateStaticContent() {
        // Update nav aria-labels
        document.querySelectorAll('nav').forEach(nav => {
            const label = nav.getAttribute(`data-lang-${currentLang}`);
            if (label) nav.setAttribute('aria-label', label);
        });
        
        // Update footer text
        const footerSpan = document.querySelector('footer span');
        if (footerSpan) {
            const text = footerSpan.getAttribute(`data-lang-${currentLang}`);
            if (text) footerSpan.textContent = text;
        }
    }

    // Function to initialize everything after components are loaded
    function initializeComponents() {
        // Populate navigation with correct language
        populateNavigation();
        
        // Set up language toggle
        setupLanguageToggle();
        
        // Translate static content
        translateStaticContent();

        // Initialize theme toggles
        initializeThemeToggles();
        
        // Initialize mobile menu
        initializeMobileMenu();
    }

    // Theme toggle initialization
    function initializeThemeToggles() {
        // Determine aria-label based on language
        const themeToggleLabel = currentLang === 'fr' ? 'Basculer le thème' : 'Toggle theme';
        const darkModeLabel = currentLang === 'fr' ? 'Basculer le mode sombre' : 'Toggle Dark Mode';
        
        // Desktop theme toggle
        new DayNightToggle('#theme-toggle-container', {
            syncBody: false,
            initialState: window.__INITIAL_THEME__,
            buttonTitle: darkModeLabel,
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
                buttonTitle: darkModeLabel,
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

    // Determine the correct base path based on current location
    function getBasePath() {
        const path = window.location.pathname;
        // If we're in /en/ or /fr/ folder, go up one level
        if (path.includes('/en/') || path.includes('/fr/')) {
            return '../assets/components/';
        }
        // If we're at root, use relative path
        return 'assets/components/';
    }

    const basePath = getBasePath();

    // Load components when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            await Promise.all([
                loadComponent('header-placeholder', basePath + 'header.html'),
                loadComponent('footer-placeholder', basePath + 'footer.html')
            ]);
            initializeComponents();
        });
    } else {
        (async () => {
            await Promise.all([
                loadComponent('header-placeholder', basePath + 'header.html'),
                loadComponent('footer-placeholder', basePath + 'footer.html')
            ]);
            initializeComponents();
        })();
    }
})();