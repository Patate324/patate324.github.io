/*
*   Website Design & Development Disclosure
*   ========================================
*   This website was created with the assistance of Claude AI (Anthropic) and Copilot AI (Microsoft).
*   AI was used for: code generation, design layout, translation, and content structuring.
*   
*   Final review, content, content editing, and customization was performed by the site owner.
*/

/*
 * FADE-IN ANIMATION CONTROLLER
 * =============================
 * 
 * HOW IT WORKS:
 * 1. Finds all elements with fade-in classes
 * 2. Watches them with IntersectionObserver (detects when they enter viewport)
 * 3. When 10% of an element becomes visible, adds the "visible" class
 * 4. Auto-staggers animations: each element gets a 120ms delay
 * 5. Stops watching each element after it animates
 */

(function() {
    'use strict';

    function initFadeIn() {
        // Find all elements with fade-in classes
        const fadeInElements = document.querySelectorAll(
            '.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale'
        );

        if (fadeInElements.length === 0) return;

        // Filter out hidden elements for stagger calculation
        const visibleElements = Array.from(fadeInElements).filter(el => {
            return !el.classList.contains('hidden');
        });

        // Create observer to watch when elements enter viewport
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    // Auto-stagger: 120ms delay between each VISIBLE element
                    const index = visibleElements.indexOf(el);
                    if (index !== -1) {
                        el.style.transitionDelay = `${index * 0.12}s`;
                    }
                    
                    // Add visible class to trigger animation
                    el.classList.add('visible');
                    
                    // Stop watching this element (animate only once)
                    obs.unobserve(el);
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% visible
            rootMargin: '0px 0px -50px 0px' // Start slightly before element enters
        });

        // Start observing all fade-in elements
        fadeInElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFadeIn);
    } else {
        initFadeIn();
    }
})();