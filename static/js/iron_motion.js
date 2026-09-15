/**
 * Iron Revolution - Advanced GSAP, Lenis, Reactbits & 21st.dev Motion Engine
 * Delivers ultra-smooth momentum scrolling, magnetic buttons, spotlight cards,
 * kinetic typography reveals, and 21st.dev border-beam lighting.
 */

(function () {
    'use strict';

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 992;

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIronMotion);
    } else {
        initIronMotion();
    }

    function initIronMotion() {
        // Register GSAP Plugins if available
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Initialize modules
        initLenisScroll();
        initAmbientCursor();
        initKineticTypography();
        initSpotlightCards();
        initMagneticButtons();
        initAnimatedCounters();
        initScrollReveals();
        initHeroParallaxScrub();
        initStickyHeaderMorph();
        initDemoModal();
        initMobileDrawer();
    }

    /* ==========================================================================
       1. Lenis Smooth Momentum Scrolling + GSAP Ticker Sync
       ========================================================================== */
    let lenisInstance = null;
    function initLenisScroll() {
        // Disable on mobile (< 992px) for native momentum touch scrolling and zero ScrollTrigger lag
        if (prefersReducedMotion || typeof Lenis === 'undefined' || window.innerWidth < 992) return;

        try {
            lenisInstance = new Lenis({
                duration: 1.15,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 0.95,
                touchMultiplier: 1.8,
                infinite: false
            });

            // Synchronize Lenis with GSAP ScrollTrigger
            if (typeof ScrollTrigger !== 'undefined') {
                lenisInstance.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time) => {
                    lenisInstance.raf(time * 1000);
                });
                gsap.ticker.lagSmoothing(0);
            } else {
                function raf(time) {
                    lenisInstance.raf(time);
                    requestAnimationFrame(raf);
                }
                requestAnimationFrame(raf);
            }

            // Handle internal anchor links smoothly
            document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
                anchor.addEventListener('click', function (e) {
                    const href = this.getAttribute('href');
                    if (href && href !== '#' && href.startsWith('#')) {
                        const target = document.querySelector(href);
                        if (target) {
                            e.preventDefault();
                            lenisInstance.scrollTo(target, { offset: -80, duration: 1.2 });
                        }
                    }
                });
            });
        } catch (err) {
            console.warn('[IronMotion] Lenis init failed, fallback to native scroll', err);
        }
    }

    /* ==========================================================================
       2. 21st.dev Ambient Cursor Halo Glow
       ========================================================================== */
    function initAmbientCursor() {
        if (!isDesktop || prefersReducedMotion) return;

        let glow = document.querySelector('.ir_cursor_glow');
        if (!glow) {
            glow = document.createElement('div');
            glow.className = 'ir_cursor_glow';
            document.body.appendChild(glow);
        }

        if (typeof gsap === 'undefined') return;

        const setX = gsap.quickTo(glow, 'x', { duration: 0.45, ease: 'power2.out' });
        const setY = gsap.quickTo(glow, 'y', { duration: 0.45, ease: 'power2.out' });

        window.addEventListener('mousemove', (e) => {
            if (!document.body.classList.contains('cursor-active')) {
                document.body.classList.add('cursor-active');
            }
            setX(e.clientX);
            setY(e.clientY);
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-active');
        });
    }

    /* ==========================================================================
       3. Reactbits & 21st.dev Spotlight Cards with 3D Perspective Tilt
       ========================================================================== */
    function initSpotlightCards() {
        const cards = document.querySelectorAll('.spotlight-card, [data-spotlight]');
        if (!cards.length) return;

        cards.forEach((card) => {
            // Ensure class exists
            card.classList.add('spotlight-card');

            if (!isDesktop || prefersReducedMotion) return;

            let cardRect = null;

            card.addEventListener('mouseenter', () => {
                cardRect = card.getBoundingClientRect();
            });

            card.addEventListener('mousemove', (e) => {
                if (!cardRect) cardRect = card.getBoundingClientRect();
                const x = e.clientX - cardRect.left;
                const y = e.clientY - cardRect.top;

                // Update CSS variables for radial spotlight and border glow
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // 3D Perspective Tilt
                if (typeof gsap !== 'undefined') {
                    const normX = (x / cardRect.width - 0.5) * 2;   // -1 to 1
                    const normY = (y / cardRect.height - 0.5) * 2;  // -1 to 1

                    gsap.to(card, {
                        rotateY: normX * 5.5,
                        rotateX: -normY * 5.5,
                        transformPerspective: 1000,
                        duration: 0.28,
                        ease: 'power1.out',
                        overwrite: 'auto'
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                cardRect = null;
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.65,
                        ease: 'elastic.out(1, 0.4)',
                        overwrite: 'auto'
                    });
                }
            });
        });
    }

    /* ==========================================================================
       4. Reactbits Magnetic Buttons
       ========================================================================== */
    function initMagneticButtons() {
        if (!isDesktop || prefersReducedMotion || typeof gsap === 'undefined') return;

        const magneticButtons = document.querySelectorAll('.magnetic-btn, [data-magnetic]');
        magneticButtons.forEach((btn) => {
            const xToBtn = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power2.out' });
            const yToBtn = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power2.out' });

            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                // Subtle, controlled magnetic pull (bounded to +/- 12px)
                const deltaX = Math.max(-12, Math.min(12, (e.clientX - centerX) * 0.22));
                const deltaY = Math.max(-12, Math.min(12, (e.clientY - centerY) * 0.22));

                xToBtn(deltaX);
                yToBtn(deltaY);
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.4)',
                    overwrite: 'auto'
                });
            });
        });
    }

    /* ==========================================================================
       5. Kinetic Typography (Split-Text Word Reveal)
       ========================================================================== */
    function initKineticTypography() {
        // Disable on mobile (< 992px) to prevent word wrapping glitches on narrow screens
        if (prefersReducedMotion || typeof gsap === 'undefined' || window.innerWidth < 992) return;

        const splitElements = document.querySelectorAll('[data-split-text]');
        splitElements.forEach((el) => {
            const rawText = el.innerText.trim();
            const words = rawText.split(/\s+/);

            el.innerHTML = words.map(word => {
                return `<span class="kinetic-word-wrap"><span class="kinetic-word">${word}</span></span>`;
            }).join(' ');

            const wordSpans = el.querySelectorAll('.kinetic-word');

            // If inside hero, animate immediately on load
            if (el.closest('.iron_hero_section')) {
                gsap.from(wordSpans, {
                    y: '115%',
                    opacity: 0,
                    rotateZ: 3,
                    duration: 1.1,
                    stagger: 0.05,
                    ease: 'power4.out',
                    delay: 0.15
                });
            } else if (typeof ScrollTrigger !== 'undefined') {
                gsap.from(wordSpans, {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    },
                    y: '115%',
                    opacity: 0,
                    rotateZ: 3,
                    duration: 0.9,
                    stagger: 0.04,
                    ease: 'power4.out'
                });
            }
        });
    }

    /* ==========================================================================
       6. Animated Numeric Counters (Reactbits style count-up)
       ========================================================================== */
    function initAnimatedCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        if (!counters.length) return;

        counters.forEach((el) => {
            const targetVal = parseFloat(el.getAttribute('data-counter-target') || '0');
            const suffix = el.getAttribute('data-counter-suffix') || '';

            if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                el.innerHTML = `${targetVal}<span>${suffix}</span>`;
                return;
            }

            const counterObj = { val: 0 };

            ScrollTrigger.create({
                trigger: el,
                start: 'top 92%',
                once: true,
                onEnter: () => {
                    gsap.to(counterObj, {
                        val: targetVal,
                        duration: 2.2,
                        ease: 'power2.out',
                        onUpdate: () => {
                            el.innerHTML = `${Math.round(counterObj.val)}<span>${suffix}</span>`;
                        }
                    });
                }
            });
        });
    }

    /* ==========================================================================
       7. Staggered ScrollTrigger Reveals (Cards, Sections, Grids)
       ========================================================================== */
    function initScrollReveals() {
        // Disable on mobile/tablet (< 992px) to prevent empty black voids and ensure instant card/pillar visibility
        if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || window.innerWidth < 992) return;

        // Features Area Cards
        const featureCards = document.querySelectorAll('.features_area .single_feature');
        if (featureCards.length) {
            gsap.from(featureCards, {
                scrollTrigger: {
                    trigger: '.features_area',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                y: 50,
                opacity: 0,
                scale: 0.94,
                duration: 0.85,
                stagger: 0.12,
                ease: 'power3.out'
            });
        }

        // Services Showcase Cards
        const serviceCards = document.querySelectorAll('.services_showcase_section .service_card');
        if (serviceCards.length) {
            gsap.from(serviceCards, {
                scrollTrigger: {
                    trigger: '.services_showcase_section',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                y: 40,
                opacity: 0,
                scale: 0.98,
                duration: 0.75,
                stagger: 0.1,
                ease: 'power3.out',
                clearProps: 'all'
            });
        }

        // Highlights Showcase Cards
        const highlightCards = document.querySelectorAll('.highlights_showcase_section .highlight_card');
        if (highlightCards.length) {
            gsap.from(highlightCards, {
                scrollTrigger: {
                    trigger: '.highlights_showcase_section',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                y: 40,
                opacity: 0,
                scale: 0.98,
                duration: 0.75,
                stagger: 0.1,
                ease: 'power3.out',
                clearProps: 'all'
            });
        }

        // Business Intro Pillars
        const pillarItems = document.querySelectorAll('.intro_pillar_item');
        if (pillarItems.length) {
            gsap.from(pillarItems, {
                scrollTrigger: {
                    trigger: '.intro_pillar_list',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                x: -30,
                opacity: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: 'power2.out'
            });
        }

        // Category Area Cards
        const catCards = document.querySelectorAll('.catagory_area .single_catagory');
        if (catCards.length) {
            gsap.from(catCards, {
                scrollTrigger: {
                    trigger: '.catagory_area',
                    start: 'top 82%',
                    toggleActions: 'play none none none'
                },
                y: 40,
                opacity: 0,
                duration: 0.9,
                stagger: 0.18,
                ease: 'power3.out'
            });
        }

        // Pricing Cards
        const pricingCards = document.querySelectorAll('.priscing_area .single_prising');
        if (pricingCards.length) {
            gsap.from(pricingCards, {
                scrollTrigger: {
                    trigger: '.priscing_area',
                    start: 'top 78%',
                    toggleActions: 'play none none none'
                },
                y: 60,
                opacity: 0,
                duration: 0.9,
                stagger: 0.15,
                ease: 'power3.out'
            });
        }

        // Gallery Items
        const galleryItems = document.querySelectorAll('.gallery_area .single_gallery');
        if (galleryItems.length) {
            gsap.from(galleryItems, {
                scrollTrigger: {
                    trigger: '.gallery_area',
                    start: 'top 82%',
                    toggleActions: 'play none none none'
                },
                y: 40,
                opacity: 0,
                scale: 0.95,
                duration: 0.75,
                stagger: 0.08,
                ease: 'power2.out'
            });
        }

        // Team / Trainer Cards
        const trainerCards = document.querySelectorAll('.team_area .single_team');
        if (trainerCards.length) {
            gsap.from(trainerCards, {
                scrollTrigger: {
                    trigger: '.team_area',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                y: 50,
                opacity: 0,
                duration: 0.85,
                stagger: 0.14,
                ease: 'power3.out'
            });
        }
    }

    /* ==========================================================================
       8. Hero Parallax Scroll Scrubbing (Fixed Background Mode)
       Background image stays fixed; hero text smoothly floats up on scroll.
       ========================================================================== */
    function initHeroParallaxScrub() {
        if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const heroSection = document.querySelector('.iron_hero_section');
        const heroText = document.querySelector('.hero_text_wrap');
        const heroGlow = document.querySelector('.hero_ambient_glow');

        if (!heroSection) return;

        // Atmospheric glow subtle fade on scroll (no translation/movement)
        if (heroGlow) {
            gsap.to(heroGlow, {
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.8
                },
                opacity: 0.15,
                ease: 'none'
            });
        }

        // Hero text subtle fade & upward push on scroll
        if (heroText) {
            gsap.to(heroText, {
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: '75% top',
                    scrub: 0.5
                },
                y: -50,
                opacity: 0.2,
                ease: 'none'
            });
        }
    }

    /* ==========================================================================
       9. Glassmorphic Sticky Header Morph on Scroll
       ========================================================================== */
    function initStickyHeaderMorph() {
        const header = document.querySelector('#sticky-header');
        if (!header) return;

        const handleScroll = () => {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    /* ==========================================================================
       10. Interactive Demo Modal Controller
       ========================================================================== */
    function initDemoModal() {
        const modal = document.querySelector('.ir_demo_modal');
        if (!modal) return;

        const openButtons = document.querySelectorAll('[data-open-demo]');
        const closeButtons = modal.querySelectorAll('.ir_modal_close, .ir_modal_backdrop');
        const tabButtons = modal.querySelectorAll('.ir_tab_btn');
        const tabPanes = modal.querySelectorAll('.ir_tab_content');

        function openModal(targetTab) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (lenisInstance) lenisInstance.stop();

            if (targetTab) {
                switchTab(targetTab);
            }
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (lenisInstance) lenisInstance.start();
        }

        function switchTab(tabId) {
            tabButtons.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
            });
            tabPanes.forEach(pane => {
                pane.classList.toggle('active', pane.getAttribute('id') === tabId);
            });
        }

        openButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = btn.getAttribute('data-open-demo');
                openModal(targetTab);
            });
        });

        closeButtons.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                switchTab(tabId);
            });
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Biometric Scan Simulator Interaction
        const scanBtn = modal.querySelector('#trigger-scan-demo-btn');
        const scanStatus = modal.querySelector('#scan-status-text');
        const scanHud = modal.querySelector('.scanner_hud');
        if (scanBtn && scanStatus) {
            scanBtn.addEventListener('click', () => {
                scanBtn.disabled = true;
                scanBtn.innerText = 'Scanning Biometrics...';
                scanStatus.innerText = 'Analyzing electrical bio-impedance & lean mass...';
                if (scanHud) scanHud.style.animationDuration = '2s';

                setTimeout(() => {
                    scanBtn.disabled = false;
                    scanBtn.innerText = 'Run New Scan';
                    scanStatus.innerHTML = '<span style="color:#22c55e;">✓ Scan Complete!</span> Segmental Muscle: +2.4kg Lean Mass | Visceral Fat: Grade 3 (Optimal)';
                    if (scanHud) scanHud.style.animationDuration = '14s';
                }, 1600);
            });
        }
    }

    /* ==========================================================================
       11. Bespoke Luxury Mobile Navigation Drawer
       ========================================================================== */
    function initMobileDrawer() {
        const toggleBtn = document.querySelector('#irMobileNavToggle');
        const drawer = document.querySelector('#irMobileDrawer');
        const backdrop = document.querySelector('#irDrawerBackdrop');
        const closeBtn = document.querySelector('#irDrawerClose');
        const drawerLinks = document.querySelectorAll('.ir_drawer_link, .ir_drawer_actions a');

        if (!toggleBtn || !drawer) return;

        function openDrawer() {
            drawer.classList.add('active');
            if (backdrop) backdrop.classList.add('active');
            toggleBtn.classList.add('active');
            toggleBtn.setAttribute('aria-expanded', 'true');
            drawer.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (lenisInstance) lenisInstance.stop();
        }

        function closeDrawer() {
            drawer.classList.remove('active');
            if (backdrop) backdrop.classList.remove('active');
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            drawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lenisInstance) lenisInstance.start();
        }

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (drawer.classList.contains('active')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeDrawer();
            });
        }

        if (backdrop) {
            backdrop.addEventListener('click', closeDrawer);
        }

        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeDrawer();
            });
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('active')) {
                closeDrawer();
            }
        });
    }

})();
