/*
*   Website Design & Development Disclosure
*   ========================================
*   This website was created with the assistance of Claude AI (Anthropic) and Copilot AI (Microsoft).
*   AI was used for: code generation, design layout, translation, and content structuring.
*   
*   Final review, content, content editing, and customization was performed by the site owner.
*/

/*
 * FADE-IN ANIMATION CONTROLLER v3
 * ================================
 * 
 * HOW IT WORKS:
 * 1. Finds all elements with fade-in classes
 * 2. Immediately animates elements already in viewport on page load
 * 3. Watches remaining elements with IntersectionObserver
 * 4. Elements on page load: stagger by 120ms each
 * 5. Elements on scroll: stagger only within their batch (feels snappier)
 * 6. Stops watching each element after it animates
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

        // Check which elements are already in viewport on page load
        const elementsInViewport = [];
        const elementsOutOfViewport = [];
        
        visibleElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const inViewport = (
                rect.top < window.innerHeight &&
                rect.bottom > 0
            );
            
            if (inViewport) {
                elementsInViewport.push(el);
            } else {
                elementsOutOfViewport.push(el);
            }
        });

        // Immediately animate elements already in viewport
        elementsInViewport.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.135}s`;
            // Use requestAnimationFrame to ensure smooth animation
            requestAnimationFrame(() => {
                el.classList.add('visible');
            });
        });

        // Create observer for elements not yet in viewport
        if (elementsOutOfViewport.length > 0) {
            // Track elements that appear together in one scroll
            let batchQueue = [];
            let batchTimer = null;

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        
                        // Add to current batch
                        batchQueue.push(el);
                        
                        // Clear existing timer
                        if (batchTimer) {
                            clearTimeout(batchTimer);
                        }
                        
                        // Process batch after brief delay (catches elements appearing together)
                        batchTimer = setTimeout(() => {
                            batchQueue.forEach((batchEl, batchIndex) => {
                                // Stagger only within this batch
                                batchEl.style.transitionDelay = `${batchIndex * 0.09}s`;
                                batchEl.classList.add('visible');
                                obs.unobserve(batchEl);
                            });
                            batchQueue = [];
                        }, 50);
                    }
                });
            }, {
                threshold: 0.15, // Trigger when 15% visible
                rootMargin: '0px 0px -50px 0px' // Start slightly before element enters
            });

            // Start observing elements not in viewport
            elementsOutOfViewport.forEach(el => {
                observer.observe(el);
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFadeIn);
    } else {
        initFadeIn();
    }
})();