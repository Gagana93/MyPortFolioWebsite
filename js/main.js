/* ── Utility ───────────────────────────────────────────────── */
const rot13 = (message) => {
    const alpha = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM';
    return message.replace(/[a-z]/gi, letter => alpha[alpha.indexOf(letter) + 13]);
};

/* ── Copyright year ────────────────────────────────────────── */
document.getElementById('copyright-year').textContent = new Date().getFullYear();

/* ── Email reveal ──────────────────────────────────────────── */
let emailShown = false;
document.getElementById('iemail').addEventListener('click', function () {
    const demail = document.getElementById('demail');
    const msg = 'tntnanantraqen02@tznvy.pbz';
    if (!emailShown) {
        demail.textContent = rot13(msg);
        demail.style.opacity = '1';
        this.setAttribute('aria-label', 'Hide email address');
    } else {
        demail.style.opacity = '0';
        setTimeout(() => { demail.textContent = ''; }, 300);
        this.setAttribute('aria-label', 'Click to reveal email address');
    }
    emailShown = !emailShown;
});

/* ── Dark mode ─────────────────────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
        iconSun.style.display = 'block';
        iconMoon.style.display = 'none';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        iconSun.style.display = 'none';
        iconMoon.style.display = 'block';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ── Sticky nav + scroll tint ──────────────────────────────── */
window.addEventListener('scroll', function () {
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    if (window.scrollY > 0) {
        nav.classList.add('scrolled');
        header.classList.remove('gradient-background');
    } else {
        nav.classList.remove('scrolled');
        header.classList.add('gradient-background');
    }
    updateActiveNav();
    toggleBackToTop();
}, { passive: true });

/* ── Active nav highlighting ───────────────────────────────── */
function updateActiveNav() {
    const sections = document.querySelectorAll('.section, #dhead');
    const navLinks = document.querySelectorAll('.nav-right .nav-link, #mobile-menu .nav-link');
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active-nav');
        const href = link.getAttribute('href');
        if (href && href.substring(1) === current) {
            link.classList.add('active-nav');
        }
    });
}

/* ── Mobile menu ───────────────────────────────────────────── */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    this.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

/* ── Smooth nav scroll ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', event => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            event.preventDefault();
            const target = document.getElementById(href.substring(1));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
                if (mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenu.setAttribute('aria-hidden', 'true');
                }
            }
        });
    });
});

/* ── Tab system ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            document.getElementById(tabId).classList.add('active');
        });
    });
});

/* ── Project modal with focus trap ────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-project-content');
    const closeBtn = modal.querySelector('.close');
    let lastFocused = null;

    function openModal(content) {
        lastFocused = document.activeElement;
        modalContent.innerHTML = content;
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => closeBtn.focus(), 50);
    }

    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.project-card');
            const details = card.querySelector('.project-details').innerHTML;
            const title = card.querySelector('h4').textContent;
            const img = card.querySelector('img').outerHTML;
            const brief = card.querySelector('.project-brief').innerHTML;
            const tools = card.querySelector('.project-tools').textContent;

            openModal(`
                <h3 id="modal-project-title">${title}</h3>
                ${img}
                <div class="modal-brief">${brief}</div>
                <div class="modal-tools"><strong>Tools &amp; Methods:</strong> ${tools}</div>
                ${details}
            `);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    /* Focus trap */
    modal.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeModal(); return; }
        if (e.key !== 'Tab') return;
        const focusable = modal.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
});

/* ── Certificate modal ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('certificate-modal');
    if (!modal) return;
    const modalImg = document.getElementById('certificate-image');
    const closeBtn = modal.querySelector('.close');
    let lastFocused = null;

    document.querySelectorAll('.image-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            lastFocused = document.activeElement;
            modalImg.src = this.getAttribute('data-certificate');
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        });
    });

    function closeCertModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    closeBtn.addEventListener('click', closeCertModal);
    window.addEventListener('click', e => { if (e.target === modal) closeCertModal(); });
    modal.addEventListener('keydown', e => { if (e.key === 'Escape') closeCertModal(); });
});

/* ── Lazy image loading ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    obs.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });
        lazyImages.forEach(img => observer.observe(img));
    } else {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});

/* ── Back to top button ────────────────────────────────────── */
const backToTop = document.getElementById('back-to-top');

function toggleBackToTop() {
    if (window.scrollY > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});