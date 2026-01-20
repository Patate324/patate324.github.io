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
 * 1. Finds all elements with fade-in classes (.fade-in, .fade-in-left, etc.)
 * 2. Watches them using IntersectionObserver (detects when they enter viewport)
 * 3. When 10% of an element becomes visible, adds the "visible" class
 * 4. Auto-staggers animations: each element gets a 120ms delay based on its position
 * 5. Stops watching each element after it animates (performance optimization)
 * 
 * CUSTOMIZATION OPTIONS:
 * - Change 'threshold' (line 57) to control when animation triggers
 *   Example: 0.1 = 10% visible, 0.5 = 50% visible
 * 
 * - Change stagger timing (line 47): `index * 0.12` 
 *   Example: `index * 0.15` = 150ms between elements
 * 
 * - Change 'rootMargin' (line 58) to trigger earlier/later
 *   Example: '-100px' = wait until 100px into viewport
 * 
 * TROUBLESHOOTING:
 * - Elements not animating? Make sure animations.css is loaded first
 * - Animations too fast/slow? Adjust transition duration in animations.css
 * - Want animations to repeat? Remove obs.unobserve(el) on line 52
 */

// Fade-in animation controller with IntersectionObserver
(function() {
    'use strict';

    // Wait for DOM to be ready
    function initFadeIn() {
        // STEP 1: Find all elements with fade-in classes
        const fadeInElements = document.querySelectorAll(
            '.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale'
        );

        // If no elements found, exit early (nothing to animate)
        if (fadeInElements.length === 0) {
            return;
        }

        // STEP 2: Create an observer to watch when elements enter the viewport
        const observer = new IntersectionObserver((entries, obs) => {
            // Loop through each element that has crossed the visibility threshold
            entries.forEach(entry => {
                // Check if element is now visible
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    // STEP 3: Auto-stagger calculation
                    // Get the index of this element in the list of all fade-in elements
                    const allElements = Array.from(fadeInElements);
                    const index = allElements.indexOf(el);
                    
                    // Apply staggered delay: 120ms (0.12s) between each element
                    // Element 0: 0ms, Element 1: 120ms, Element 2: 240ms, etc.
                    el.style.transitionDelay = `${index * 0.12}s`;
                    
                    // STEP 4: Add the "visible" class to trigger the CSS animation
                    el.classList.add('visible');
                    
                    // STEP 5: Stop watching this element (animate only once)
                    // Remove this line if you want animations to repeat on scroll
                    obs.unobserve(el);
                }
            });
        }, {
            // Trigger when 10% of the element is visible
            // Change to 0.5 for 50%, 1.0 for fully visible, etc.
            threshold: 0.1,
            
            // rootMargin: Start animation slightly before element enters viewport
            // Format: "top right bottom left" (like CSS margin)
            // Negative = trigger earlier, Positive = trigger later
            rootMargin: '0px 0px -50px 0px'
        });

        // STEP 6: Start observing all fade-in elements
        fadeInElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        // DOM still loading, wait for it
        document.addEventListener('DOMContentLoaded', initFadeIn);
    } else {
        // DOM already loaded, run immediately
        initFadeIn();
    }
})();