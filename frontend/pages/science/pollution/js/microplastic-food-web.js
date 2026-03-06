/* ============================================================
   Microplastics in the Food Chain – Interactive Journey
   JavaScript Controller
   ============================================================ */

(function () {
    'use strict';

    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('mp-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('mp-theme', next);
    });

    // ===== HERO STAT COUNTER ANIMATION =====
    function animateCounters() {
        document.querySelectorAll('.stat-number[data-target]').forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    // ===== HERO FLOATING PARTICLES =====
    function createHeroParticles() {
        const container = document.getElementById('heroParticles');
        if (!container) return;

        const colors = [
            'rgba(14,165,233,0.4)',
            'rgba(34,211,238,0.3)',
            'rgba(168,85,247,0.3)',
            'rgba(74,222,128,0.25)',
            'rgba(239,68,68,0.2)'
        ];

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero-particle');
            const size = Math.random() * 6 + 2;
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}%;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation-duration: ${Math.random() * 15 + 10}s;
                animation-delay: ${Math.random() * 10}s;
            `;
            container.appendChild(particle);
        }
    }

    // ===== SECTION 1: TIMELINE JOURNEY =====
    const timelineStages = document.querySelectorAll('.timeline-stage');
    const timelineBar = document.getElementById('timelineBar');

    function activateStage(stageNum) {
        timelineStages.forEach(stage => {
            const num = parseInt(stage.dataset.stage, 10);
            stage.classList.remove('active', 'completed');
            if (num < stageNum) stage.classList.add('completed');
            if (num === stageNum) stage.classList.add('active');
        });

        // Update progress bar
        const progress = ((stageNum - 1) / (timelineStages.length - 1)) * 100;
        if (timelineBar) timelineBar.style.height = progress + '%';
    }

    timelineStages.forEach(stage => {
        stage.addEventListener('click', () => {
            activateStage(parseInt(stage.dataset.stage, 10));
        });
    });

    // ===== SECTION 2: BIOMAGNIFICATION PYRAMID =====
    const pyramidLevels = document.querySelectorAll('.pyramid-level');
    const toxicityFill = document.getElementById('toxicityFill');
    const toxicityValue = document.getElementById('toxicityValue');

    function activatePyramidLevel(level) {
        pyramidLevels.forEach(pl => {
            pl.classList.remove('active');
        });

        const targetLevel = document.querySelector(`.pyramid-level[data-level="${level}"]`);
        if (targetLevel) {
            targetLevel.classList.add('active');

            const concentration = parseInt(targetLevel.dataset.concentration, 10);
            const name = targetLevel.dataset.name;

            // Update toxicity meter
            const pct = Math.min((Math.log10(concentration) / Math.log10(10000)) * 100, 100);
            if (toxicityFill) toxicityFill.style.width = pct + '%';
            if (toxicityValue) {
                toxicityValue.textContent = concentration.toLocaleString() + 'x';
                // Change color based on level
                const colors = ['#4ade80', '#facc15', '#f97316', '#ef4444', '#a855f7'];
                toxicityValue.style.color = colors[level - 1] || '#4ade80';
            }

            // Generate particles in shape
            generateLevelParticles(targetLevel, concentration);
        }
    }

    function generateLevelParticles(levelEl, concentration) {
        const container = levelEl.querySelector('.level-particles');
        if (!container) return;
        container.innerHTML = '';

        const count = Math.min(Math.floor(Math.log10(concentration) * 5) + 3, 25);
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                border-radius: 50%;
                background: rgba(239, 68, 68, ${0.3 + Math.random() * 0.5});
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: toxicPulse ${1 + Math.random() * 2}s ease infinite ${Math.random() * 2}s;
                box-shadow: 0 0 ${4 + Math.random() * 6}px rgba(239, 68, 68, 0.5);
            `;
            container.appendChild(dot);
        }
    }

    pyramidLevels.forEach(level => {
        level.addEventListener('click', () => {
            activatePyramidLevel(parseInt(level.dataset.level, 10));
        });
    });

    // ===== SECTION 3: IMPACT CALCULATOR =====
    const seafoodSlider = document.getElementById('seafoodSlider');
    const bottledWaterSlider = document.getElementById('bottledWaterSlider');
    const tapWaterSlider = document.getElementById('tapWaterSlider');
    const teaSlider = document.getElementById('teaSlider');
    const saltYes = document.getElementById('saltYes');
    const saltNo = document.getElementById('saltNo');
    const calculateBtn = document.getElementById('calculateBtn');
    const calcResults = document.getElementById('calcResults');

    let useSeaSalt = true;

    // Slider value updates
    function setupSlider(slider, display) {
        if (!slider || !display) return;
        slider.addEventListener('input', () => {
            display.textContent = slider.value;
        });
    }

    setupSlider(seafoodSlider, document.getElementById('seafoodValue'));
    setupSlider(bottledWaterSlider, document.getElementById('bottledWaterValue'));
    setupSlider(tapWaterSlider, document.getElementById('tapWaterValue'));
    setupSlider(teaSlider, document.getElementById('teaValue'));

    // Salt toggle
    if (saltYes) {
        saltYes.addEventListener('click', () => {
            useSeaSalt = true;
            saltYes.classList.add('active');
            saltNo.classList.remove('active');
        });
    }
    if (saltNo) {
        saltNo.addEventListener('click', () => {
            useSeaSalt = false;
            saltNo.classList.add('active');
            saltYes.classList.remove('active');
        });
    }

    // Calculate
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateIntake);
    }

    function calculateIntake() {
        // Microplastic estimates based on peer-reviewed research:
        // Seafood: ~11,000 particles per meal (shellfish heavy), ~0.5g plastic/meal avg
        // Bottled water: ~325 particles per liter (Orb Media, 2018)
        // Tap water: ~5.5 particles per liter
        // Sea salt: ~600 particles per kg, ~5g salt/day = ~3 particles/day
        // Tea bags: ~11.6 billion nanoplastics per bag (McGill, 2019) → ~0.016g per bag

        const seafoodMeals = parseInt(seafoodSlider.value, 10);
        const bottledL = parseFloat(bottledWaterSlider.value);
        const tapL = parseFloat(tapWaterSlider.value);
        const teaBags = parseInt(teaSlider.value, 10);

        // Weekly particle estimates
        const seafoodParticles = seafoodMeals * 11000;
        const bottledParticles = bottledL * 7 * 325;
        const tapParticles = tapL * 7 * 5.5;
        const saltParticles = useSeaSalt ? 7 * 3 : 0;
        const teaParticles = teaBags * 7 * 11600000; // nanoplastics

        // Weight estimates (grams per week)
        const seafoodGrams = seafoodMeals * 0.042;       // ~0.042g per seafood meal
        const bottledGrams = bottledL * 7 * 0.005;       // ~0.005g per liter
        const tapGrams = tapL * 7 * 0.0001;              // ~0.0001g per liter
        const saltGrams = useSeaSalt ? 0.003 : 0;        // ~0.003g per week
        const teaGrams = teaBags * 7 * 0.016;            // ~0.016g per bag

        const totalGrams = seafoodGrams + bottledGrams + tapGrams + saltGrams + teaGrams;
        const totalParticles = seafoodParticles + bottledParticles + tapParticles + saltParticles;
        const weeklyG = totalGrams;
        const monthlyG = weeklyG * 4.33;
        const yearlyG = weeklyG * 52;
        const lifetimeKg = (yearlyG * 70) / 1000; // ~70 year exposure
        const creditCards = weeklyG / 5; // A credit card weighs ~5g

        // Update UI
        document.getElementById('weeklyGrams').textContent = weeklyG.toFixed(2) + 'g';
        document.getElementById('creditCards').textContent = creditCards.toFixed(2);
        document.getElementById('monthlyIntake').textContent = monthlyG.toFixed(1) + 'g';
        document.getElementById('yearlyIntake').textContent = yearlyG.toFixed(1) + 'g';
        document.getElementById('particlesWeek').textContent = formatNumber(totalParticles);
        document.getElementById('lifetimeIntake').textContent = lifetimeKg.toFixed(1) + 'kg';

        // Breakdown percentages
        const sources = [
            { fill: 'bdSeafood', pct: 'bdSeafoodPct', val: seafoodGrams },
            { fill: 'bdBottled', pct: 'bdBottledPct', val: bottledGrams },
            { fill: 'bdTap', pct: 'bdTapPct', val: tapGrams },
            { fill: 'bdSalt', pct: 'bdSaltPct', val: saltGrams },
            { fill: 'bdTea', pct: 'bdTeaPct', val: teaGrams }
        ];

        const maxVal = Math.max(...sources.map(s => s.val), 0.001);

        sources.forEach(s => {
            const pctOfTotal = totalGrams > 0 ? (s.val / totalGrams * 100) : 0;
            const barWidth = totalGrams > 0 ? (s.val / maxVal * 100) : 0;
            const fillEl = document.getElementById(s.fill);
            const pctEl = document.getElementById(s.pct);
            if (fillEl) fillEl.style.width = barWidth + '%';
            if (pctEl) pctEl.textContent = pctOfTotal.toFixed(1) + '%';
        });

        // Show results
        if (calcResults) calcResults.classList.add('visible');
    }

    function formatNumber(num) {
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return num.toFixed(0);
    }

    // ===== SECTION 4: MITIGATION TOGGLES =====
    const solutionToggles = document.querySelectorAll('.solution-toggle');
    const impactRing = document.getElementById('impactRing');
    const impactNumber = document.getElementById('impactNumber');
    const impactDesc = document.getElementById('impactDesc');

    const RING_CIRCUMFERENCE = 2 * Math.PI * 54; // ~339.292

    function updateMitigationImpact() {
        let totalImpact = 0;
        let activeSolutions = [];

        solutionToggles.forEach(toggle => {
            const card = toggle.closest('.mitigation-card');
            if (toggle.checked) {
                totalImpact += parseInt(card.dataset.impact, 10);
                card.classList.add('active');
                activeSolutions.push(card.querySelector('h3').textContent);
            } else {
                card.classList.remove('active');
            }
        });

        // Cap at 100%
        totalImpact = Math.min(totalImpact, 100);

        // Update ring
        const offset = RING_CIRCUMFERENCE - (totalImpact / 100) * RING_CIRCUMFERENCE;
        if (impactRing) {
            impactRing.style.strokeDashoffset = offset;
            // Color transition
            if (totalImpact > 75) {
                impactRing.style.stroke = '#4ade80';
            } else if (totalImpact > 40) {
                impactRing.style.stroke = '#facc15';
            } else if (totalImpact > 0) {
                impactRing.style.stroke = '#f97316';
            } else {
                impactRing.style.stroke = '#4ade80';
            }
        }

        if (impactNumber) {
            impactNumber.textContent = totalImpact + '%';
            impactNumber.style.color = impactRing ? impactRing.style.stroke : '#4ade80';
        }

        if (impactDesc) {
            if (activeSolutions.length === 0) {
                impactDesc.textContent = 'Toggle solutions below to see cumulative impact';
            } else if (totalImpact >= 80) {
                impactDesc.textContent = 'Excellent! Combined solutions dramatically reduce microplastic pollution.';
            } else if (totalImpact >= 50) {
                impactDesc.textContent = 'Good progress! Keep enabling solutions for greater impact.';
            } else {
                impactDesc.textContent = `${activeSolutions.length} solution${activeSolutions.length > 1 ? 's' : ''} active. Every action counts!`;
            }
        }
    }

    solutionToggles.forEach(toggle => {
        toggle.addEventListener('change', updateMitigationImpact);
    });

    // ===== NAVIGATION ACTIVE STATE =====
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('.section');

    function updateNav() {
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom > 200) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === current);
        });
    }

    // ===== SCROLL REVEAL =====
    function setupScrollReveal() {
        const reveals = document.querySelectorAll('.section-header, .timeline-stage, .pyramid-level, .mitigation-card, .calc-group');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal', 'visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        reveals.forEach(el => observer.observe(el));
    }

    // ===== AUTO-ADVANCE TIMELINE ON SCROLL =====
    function setupTimelineScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stage = parseInt(entry.target.dataset.stage, 10);
                    activateStage(stage);
                }
            });
        }, { threshold: 0.5 });

        timelineStages.forEach(stage => observer.observe(stage));
    }

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== INIT =====
    function init() {
        createHeroParticles();
        animateCounters();
        activateStage(1);
        setupScrollReveal();
        setupTimelineScroll();
        updateMitigationImpact();

        window.addEventListener('scroll', updateNav, { passive: true });

        // Auto-activate first pyramid level after a short delay
        setTimeout(() => activatePyramidLevel(1), 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
