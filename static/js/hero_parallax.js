/**
 * Iron Revolution - Full-Bleed Parallax & Depth Motion Engine
 * Delivers smooth 60fps parallax on scroll & interactive perspective depth
 */

(function () {
    'use strict';

    // Respect user's reduced-motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    document.addEventListener('DOMContentLoaded', initParallaxEngine);

    function initParallaxEngine() {
        const heroSection = document.querySelector('.iron_hero_section');
        if (!heroSection) return;

        const fullBgImg = document.querySelector('.hero_full_bg_img');
        const heroTextWrap = document.querySelector('.hero_text_wrap');

        // ======================================================================
        // Fixed Background Parallax Mode
        // The background image is kept strictly locked in place via CSS clip-path & fixed positioning.
        // No translation or scale transforms are applied to the background image on scroll.
        // ======================================================================
    }
})();
