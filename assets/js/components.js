/*
*   Website Design & Development Disclosure
*   ========================================
*   This website was created with the assistance of Claude AI (Anthropic) and Copilot AI (Microsoft).
*   AI was used for: code generation, design layout, translation, and content structuring.
*   
*   Final review, content, content editing, and customization was performed by the site owner.
*/

/*
 * COMPONENT LOADER & SITE FUNCTIONALITY
 * ======================================
 * 
 * This script handles:
 * 1. Loading shared components (header, footer, meta tags)
 * 2. Bilingual navigation (English ⇄ French)
 * 3. Theme toggle initialization
 * 4. Mobile menu functionality
 * 
 * HOW THE BILINGUAL SYSTEM WORKS:
 * - pageMap: English URLs → French URLs
 * - reversePageMap: French URLs → English URLs
 * - Language detected from URL path (/en/ or /fr/)
 * - Language toggle switches to corresponding page in other language
 * 
 * ADDING NEW PAGES:
 * 1. Add to pageMap (line 32): '/en/your-page/': '/fr/votre-page/'
 * 2. Add to navConfig (line 45) with English and French metadata
 * 3. That's it! System handles the rest automatically
 */

// Component loader - loads header and footer
(function() {
    /*
     * PAGE MAPPING SYSTEM
     * Maps English pages to their French equivalents
     */
    const pageMap = {
        '/en/': '/fr/',
        '/en/about/': '/fr/a-propos/',
        '/en/publications/': '/fr/publications/',
        '/en/blog/': '/fr/blogue/',
        '/en/contact/': '/fr/contact/'
    };

    // Create reverse map (French → English) automatically
    const reversePageMap = Object.entries(pageMap).reduce((acc, [en, fr]) => {
        acc[fr] = en;
        return acc;
    }, {});

    // Expose maps globally for 404 page to use
    window.__PAGE_MAP__ = pageMap;
    window.__REVERSE_PAGE_MAP__ = reversePageMap;

    /*
     * NAVIGATION CONFIGURATION
     * Defines all navigation links and their metadata
     * 
     * TO ADD A NEW PAGE:
     * 1. Add entry here with English path
     * 2. Add same path to pageMap above with French equivalent
     */
    const navConfig = [
        {
            enPath: '/en/',
            en: { title: 'Home page', text: 'Home' },
            fr: { title: "Page d'accueil", text: 'Accueil' }
        },
        {
            enPath: '/en/about/',
            en: { title: 'About me', text: 'About Me' },
            fr: { title: 'À propos', text: 'À propos' }
        },
        {
            enPath: '/en/publications/',
            en: { title: 'Research and publications', text: 'Publications' },
            fr: { title: 'Recherche et publications', text: 'Publications' }
        },
        {
            enPath: '/en/blog/',
            en: { title: 'Blog posts', text: 'Blog' },
            fr: { title: 'Articles de Blogue', text: 'Blogue' }
        },
        {
            enPath: '/en/contact/',
            en: { title: 'Get in touch', text: 'Contact' },
            fr: { title: 'Contacter', text: 'Contact' }
        }
    ];

    // Build complete translations object from navConfig + pageMap
    const translations = {
        en: {
            nav: navConfig.map(item => ({
                href: item.enPath,
                title: item.en.title,
                text: item.en.text
            })),
            langToggle: {
                text: 'Français',
                title: 'Passer au français'
            }
        },
        fr: {
            nav: navConfig.map(item => ({
                href: pageMap[item.enPath],
                title: item.fr.title,
                text: item.fr.text
            })),
            langToggle: {
                text: 'English',
                title: 'Switch to English'
            }
        }
    };

    /*
     * LANGUAGE DETECTION
     * Detects current language from URL path
     */
    function detectLanguage() {
        // Check if we're on 404 page with forced language
        if (window.__FORCE_404_LANGUAGE__) {
            return window.__FORCE_404_LANGUAGE__;
        }
        
        const path = window.location.pathname;
        if (path.includes('/fr/')) return 'fr';
        if (path.includes('/en/')) return 'en';
        return 'en'; // default
    }

    /*
     * GET CURRENT PAGE PATH
     * Returns normalized path with trailing slash
     */
    function getCurrentPagePath() {
        let path = window.location.pathname;
        if (!path.endsWith('/')) {
            path += '/';
        }
        return path;
    }

    /*
     * LANGUAGE TOGGLE PATH CALCULATOR
     * Finds the corresponding page in the other language
     */
    function getToggledLanguagePath() {
        const currentPath = getCurrentPagePath();
        const currentLang = detectLanguage();
        
        // Special case: 404 page just toggles language of 404 page itself
        if (currentPath === '/404.html' || currentPath === '/404/') {
            return '/404.html';
        }
        
        if (currentLang === 'en') {
            return pageMap[currentPath] || '/fr/';
        } else {
            return reversePageMap[currentPath] || '/en/';
        }
    }

    const currentLang = detectLanguage();

    /*
     * LOAD HTML COMPONENT
     * Fetches external HTML file and injects it into the page
     */
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

    /*
     * POPULATE NAVIGATION LINKS
     * Creates navigation menu items in both desktop and mobile menus
     * Marks current page with aria-current="page"
     */
    function populateNavigation() {
        const navData = translations[currentLang].nav;
        const currentPath = getCurrentPagePath();
        
        // Desktop navigation
        const navLinks = document.getElementById('nav-links');
        if (navLinks) {
            navLinks.innerHTML = navData.map(item => `
                <li><a href="${item.href}" title="${item.title}"${item.href === currentPath ? ' aria-current="page"' : ''}>${item.text}</a></li>
            `).join('');
        }
        
        // Mobile navigation
        const mobileNavLinks = document.getElementById('mobile-nav-links');
        if (mobileNavLinks) {
            mobileNavLinks.innerHTML = navData.map(item => `
                <li><a href="${item.href}" title="${item.title}"${item.href === currentPath ? ' aria-current="page"' : ''}>${item.text}</a></li>
            `).join('');
        }
    }

    /*
     * SETUP LANGUAGE TOGGLE BUTTON
     * Configures the language switcher button
     */
    function setupLanguageToggle() {
        const langData = translations[currentLang].langToggle;
        const toggledPath = getToggledLanguagePath();
        
        // Desktop language toggle
        const langToggle = document.getElementById('language-toggle');
        const langText = document.getElementById('language-text');
        if (langToggle && langText) {
            langToggle.href = toggledPath;
            langToggle.title = langData.title;
            langText.textContent = langData.text;
        }
        
        // Mobile language toggle
        const mobileLangToggle = document.getElementById('mobile-language-toggle');
        const mobileLangText = document.getElementById('mobile-language-text');
        if (mobileLangToggle && mobileLangText) {
            mobileLangToggle.href = toggledPath;
            mobileLangToggle.title = langData.title;
            mobileLangText.textContent = langData.text;
        }
    }

    /*
     * TRANSLATE STATIC CONTENT
     * Updates aria-labels and footer text based on current language
     */
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

    /*
     * INITIALIZE ALL COMPONENTS
     * Called after HTML components are loaded
     */
    function initializeComponents() {
        populateNavigation();
        setupLanguageToggle();
        translateStaticContent();
        initializeThemeToggles();
        initializeMobileMenu();
    }

    /*
     * THEME TOGGLE INITIALIZATION
     * Sets up dark/light mode toggle buttons
     */
    function initializeThemeToggles() {
        const darkModeLabel = currentLang === 'fr' ? 'Basculer le mode sombre' : 'Toggle Dark Mode';
        
        // Desktop theme toggle
        const desktopContainer = document.querySelector('#theme-toggle-container');
        if (desktopContainer) {
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
        }

        // Mobile theme toggle
        const mobileContainer = document.querySelector('#theme-toggle-container-mobile');
        if (mobileContainer) {
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

    /*
     * MOBILE MENU INITIALIZATION
     * Sets up hamburger menu and overlay functionality
     */
    function initializeMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileOverlay = document.querySelector('.mobile-menu-overlay');
        
        if (!hamburger || !mobileMenu || !mobileOverlay) return;

        // Open menu: slide in menu, show overlay, prevent body scroll
        function openMenu() {
            hamburger.classList.add('active');
            mobileMenu.classList.add('active');
            mobileOverlay.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        
        // Close menu: reverse animations, restore body scroll
        function closeMenu() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        
        // Hamburger button toggles menu
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            if (hamburger.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Clicking overlay closes menu
        mobileOverlay.addEventListener('click', function(e) {
            e.stopPropagation();
            closeMenu();
        });
        
        // Clicking menu link closes menu
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) {
                    closeMenu();
                }
            });
        });
    }

    /*
     * BASE PATH CALCULATOR
     * Determines correct path to assets based on current location
     */
    function getBasePath() {
        const path = window.location.pathname;
        
        // 404 page always uses absolute path
        if (path === '/404.html' || path === '/404/' || path.includes('404')) {
            return '/assets/components/';
        }
        
        // Language folders use absolute path
        if (path.includes('/en/') || path.includes('/fr/')) {
            return '/assets/components/';
        }
        // Root uses relative path
        return 'assets/components/';
    }

    const basePath = getBasePath();

    // Hide page until components are loaded (prevents flash of unstyled content)
    document.documentElement.style.visibility = 'hidden';

    /*
     * MAIN INITIALIZATION
     * Loads components and initializes functionality
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            await Promise.all([
                loadComponent('header-placeholder', basePath + 'header.html'),
                loadComponent('footer-placeholder', basePath + 'footer.html'),
                loadComponent('head-meta-placeholder', basePath + 'head-meta.html')
            ]);
            initializeComponents();
            // Show body after everything is loaded
            document.documentElement.style.visibility = 'visible';
        });
    } else {
        (async () => {
            await Promise.all([
                loadComponent('header-placeholder', basePath + 'header.html'),
                loadComponent('footer-placeholder', basePath + 'footer.html'),
                loadComponent('head-meta-placeholder', basePath + 'head-meta.html')
            ]);
            initializeComponents();
            // Show body after everything is loaded
            document.documentElement.style.visibility = 'visible';
        })();
    }
})();