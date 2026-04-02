/* ============================================
   PRAVIN KUMAR AV — Portfolio Interactions
   Theme toggle, grain, cabinet hover, parallax,
   Rive interactive animation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initGrain();
    initNavbar();
    initHamburger();
    initScrollAnimations();
    initCounters();
    initCabinetHover();
    initParallax();
    initSmoothScroll();
    initMemphisCursor();
});

/* ========================
   THEME TOGGLE
   ======================== */
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const saved = localStorage.getItem('theme');

    if (saved) {
        html.setAttribute('data-theme', saved);
    } else {
        const prefers = window.matchMedia('(prefers-color-scheme: light)').matches;
        html.setAttribute('data-theme', prefers ? 'light' : 'dark');
    }

    toggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

/* ========================
   GRAIN TEXTURE
   ======================== */
function initGrain() {
    const canvas = document.getElementById('grain-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
        const img = ctx.createImageData(w, h);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
            const v = Math.random() * 255;
            d[i] = d[i + 1] = d[i + 2] = v;
            d[i + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
    }

    let frame = 0;
    (function loop() {
        frame++;
        if (frame % 5 === 0) draw();
        requestAnimationFrame(loop);
    })();
}

/* ========================
   NAVBAR
   ======================== */
function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    });
}

/* ========================
   HAMBURGER MENU
   ======================== */
function initHamburger() {
    const btn = document.getElementById('hamburger');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ========================
   SCROLL ANIMATIONS
   ======================== */
function initScrollAnimations() {
    const els = document.querySelectorAll('[data-anim]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 120);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => observer.observe(el));
}

/* ========================
   STAT COUNTERS
   ======================== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-num[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNum(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));

    function animateNum(el) {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }
        requestAnimationFrame(tick);
    }
}

/* ========================
   CABINET HOVER
   ======================== */
function initCabinetHover() {
    const items = document.querySelectorAll('.cabinet-item');
    const previews = document.querySelectorAll('.preview-card');
    if (!items.length) return;

    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const id = item.dataset.preview;
            items.forEach(i => i.classList.remove('active'));
            previews.forEach(p => p.classList.remove('active'));
            item.classList.add('active');
            const t = document.querySelector(`.preview-card[data-preview-id="${id}"]`);
            if (t) t.classList.add('active');
        });
    });
}

/* ========================
   PARALLAX — 3D Objects follow mouse
   ======================== */
function initParallax() {
    const objs = document.querySelectorAll('.floating-obj');
    if (!objs.length || window.innerWidth < 900) return;

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        objs.forEach(obj => {
            const speed = parseFloat(obj.dataset.speed) || 1;
            const moveX = x * speed * 15;
            const moveY = y * speed * 15;
            /* Combine parallax movement with the float animation base */
            obj.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

/* ========================
   SMOOTH SCROLL
   ======================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* ========================
   MEMPHIS CUSTOM CURSOR
   ======================== */
function initMemphisCursor() {
    const cursor = document.getElementById('cursor');
    const follower1 = document.getElementById('follower-1');
    const follower2 = document.getElementById('follower-2');
    
    if (!cursor || window.innerWidth < 900) return; // Disable custom cursor on mobile

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // Follower physics
    let f1X = mouseX, f1Y = mouseY;
    let f2X = mouseX, f2Y = mouseY;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate update for the main dot
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    // Add hover state for links and buttons
    const interactables = document.querySelectorAll('a, button, .cabinet-item, .showcase-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    function render() {
        // Linear interpolation for smooth trailing
        f1X += (mouseX - f1X) * 0.15;
        f1Y += (mouseY - f1Y) * 0.15;
        
        f2X += (f1X - f2X) * 0.1;
        f2Y += (f1Y - f2Y) * 0.1;
        
        // Add a bit of rotation based on movement speed for follower 2 (triangle)
        const dx = mouseX - f1X;
        const dy = mouseY - f1Y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        if (follower1) {
            follower1.style.left = `${f1X}px`;
            follower1.style.top = `${f1Y}px`;
        }
        
        if (follower2) {
            follower2.style.left = `${f2X}px`;
            follower2.style.top = `${f2Y + 20}px`; // slightly offset below
            follower2.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        }
        
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
