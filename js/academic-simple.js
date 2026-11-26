// Academic Minimalist JavaScript

// Global state
const CONFIG = {
    themeKey: 'theme',
    langKey: 'language',
    visitCountKey: 'visitCount',
    githubStatsCacheKey: 'githubStats:v1',
    githubStatsTimeout: 6000
};

// Theme Management
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(CONFIG.themeKey, theme);
    
    // Update toggle button icon/title
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        if (theme === 'dark') {
            if (icon) icon.className = 'fas fa-sun';
            themeBtn.title = 'Switch to Light Mode';
        } else {
            if (icon) icon.className = 'fas fa-moon';
            themeBtn.title = 'Switch to Dark Mode';
        }
    }
}

function toggleTheme() {
    const currentTheme = localStorage.getItem(CONFIG.themeKey) || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Language Management
function setLanguage(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.lang = lang === 'en' ? 'en-US' : 'zh-CN';
    localStorage.setItem(CONFIG.langKey, lang);
    
    // Update content
    document.querySelectorAll('[data-en][data-zh]').forEach(el => {
        const content = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-zh');
        // Skip author lists handled separately or empty content
        if (!content || content === 'author-list-en' || content === 'author-list-zh') return;
        
        if (content.includes('<') && content.includes('>')) {
            el.innerHTML = content;
        } else {
            el.textContent = content;
        }
    });
    
    // Handle author lists visibility
    const authorListEn = document.querySelector('[data-en="author-list-en"]');
    const authorListZh = document.querySelector('.author-list-zh');
    if (authorListEn && authorListZh) {
        authorListEn.style.display = lang === 'en' ? '' : 'none';
        authorListZh.style.display = lang === 'en' ? 'none' : '';
    }

    // Update toggle button text
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        const langText = langBtn.querySelector('.lang-text');
        if (langText) langText.textContent = lang === 'en' ? '中' : 'EN';
        langBtn.title = lang === 'en' ? '切换语言' : 'Switch to English';
    }

    // Update page title
    updatePageTitle(lang);
    document.querySelectorAll('.publication-preview').forEach(button => {
        const title = button.closest('.publication-item').querySelector('.publication-title').textContent.trim();
        button.setAttribute('aria-label', lang === 'en' ? 'Enlarge preview for ' + title : '放大论文预览：' + title);
    });
}

function toggleLanguage() {
    const currentLang = localStorage.getItem(CONFIG.langKey) || 'en';
    const newLang = currentLang === 'en' ? 'zh' : 'en';
    setLanguage(newLang);
}

function updatePageTitle(lang) {
    const path = window.location.pathname;
    let title = '';
    
    if (path.includes('mathematical-modeling')) {
        title = lang === 'en' ? 'Mathematical Modeling | Jin Modi' : '数学建模 | Jin Modi';
    } else {
        title = lang === 'en' ? 'Jin Modi - Personal Homepage' : 'Jin Modi | 金莫迪';
    }
    document.title = title;
}

// Keep five complete news items visible, including when text wraps or changes language.
function initNewsScroll() {
    const newsList = document.querySelector('.news-list');
    if (!newsList) return;

    const visibleItems = Array.from(newsList.children).slice(0, 5);
    if (!visibleItems.length) return;

    const updateHeight = () => {
        const firstItem = visibleItems[0].getBoundingClientRect();
        const lastItem = visibleItems[visibleItems.length - 1].getBoundingClientRect();
        newsList.style.setProperty('--news-list-height', `${Math.ceil(lastItem.bottom - firstItem.top)}px`);
    };

    updateHeight();
    if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(updateHeight);
        visibleItems.forEach(item => observer.observe(item));
    } else {
        window.addEventListener('resize', updateHeight);
        new MutationObserver(updateHeight).observe(newsList, { childList: true, subtree: true, characterData: true });
        if (document.fonts) document.fonts.ready.then(updateHeight);
    }
}

// Visit Counter
function initVisitCounter() {
    const counterEl = document.getElementById('visit-count');
    if (!counterEl) return;

    let count = parseInt(localStorage.getItem(CONFIG.visitCountKey)) || 0;
    count++;
    localStorage.setItem(CONFIG.visitCountKey, count);
    counterEl.textContent = count;
}

function readGitHubStatsCache() {
    try {
        return JSON.parse(localStorage.getItem(CONFIG.githubStatsCacheKey)) || {};
    } catch (e) {
        return {};
    }
}

function writeGitHubStatsCache(cache) {
    try {
        localStorage.setItem(CONFIG.githubStatsCacheKey, JSON.stringify(cache));
    } catch (e) {
        // Stats still work when storage is disabled (for example, in private mode).
    }
}

function renderGitHubStats(el, stats) {
    if (!stats || !Number.isFinite(stats.stars) || !Number.isFinite(stats.forks)) return;

    const starsEl = el.querySelector('[data-type="stars"]');
    const forksEl = el.querySelector('[data-type="forks"]');
    if (starsEl) starsEl.textContent = stats.stars.toLocaleString();
    if (forksEl) forksEl.textContent = stats.forks.toLocaleString();
}

async function fetchJSON(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONFIG.githubStatsTimeout);

    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } finally {
        clearTimeout(timeout);
    }
}

async function fetchStatsFromGitHub(repo) {
    const data = await fetchJSON(`https://api.github.com/repos/${repo}`);
    const stats = { stars: Number(data.stargazers_count), forks: Number(data.forks_count) };
    if (!Number.isFinite(stats.stars) || !Number.isFinite(stats.forks)) throw new Error('Invalid GitHub response');
    return stats;
}

async function fetchStatsFromShields(repo) {
    const encodedRepo = repo.split('/').map(encodeURIComponent).join('/');
    const [stars, forks] = await Promise.all([
        fetchJSON(`https://img.shields.io/github/stars/${encodedRepo}.json`),
        fetchJSON(`https://img.shields.io/github/forks/${encodedRepo}.json`)
    ]);
    const stats = { stars: Number(stars.value), forks: Number(forks.value) };
    if (!Number.isFinite(stats.stars) || !Number.isFinite(stats.forks)) throw new Error('Invalid Shields response');
    return stats;
}

// Render the last successful value immediately, then refresh from two independent
// providers. Shields avoids GitHub's low anonymous API limit on shared IPs.
async function loadGitHubStats(el, cache) {
    const repo = el.getAttribute('data-repo');
    renderGitHubStats(el, cache[repo]);

    try {
        const stats = await Promise.any([
            fetchStatsFromGitHub(repo),
            fetchStatsFromShields(repo)
        ]);
        renderGitHubStats(el, stats);
        cache[repo] = { ...stats, updatedAt: Date.now() };
        writeGitHubStatsCache(cache);
    } catch (e) {
        console.warn('Failed to refresh GitHub stats for', repo);
    }
}

function initGitHubStats() {
    const cache = readGitHubStatsCache();
    const statsElements = document.querySelectorAll('.github-stats[data-repo]');
    return Promise.all(Array.from(statsElements, el => loadGitHubStats(el, cache)));
}

function initPublicationPreviews() {
    const mediaItems = document.querySelectorAll('.publication-media');
    if (!mediaItems.length) return;

    const header = document.querySelector('.header');
    let expanded = null;

    function closePreview() {
        if (!expanded) return;
        expanded.classList.remove('is-expanded');
        expanded.querySelector('button').setAttribute('aria-expanded', 'false');
        expanded = null;
    }

    function openPreview(media) {
        if (expanded === media) return;
        closePreview();
        const box = media.getBoundingClientRect();
        if (!box.width || !box.height) return;

        const margin = 12;
        const top = Math.max(0, header?.getBoundingClientRect().bottom || 0) + margin;
        const width = document.documentElement.clientWidth;
        const height = window.innerHeight;
        const scale = Math.min(2.6, (width - margin * 2) / box.width, (height - top - margin) / box.height);
        if (scale <= 1) return;

        // Clamp the enlarged frame to the viewport without resizing the publication row.
        const left = Math.max(margin, Math.min(box.left - box.width * (scale - 1) / 2, width - margin - box.width * scale));
        const y = Math.max(top, Math.min(box.top - box.height * (scale - 1) / 2, height - margin - box.height * scale));
        media.style.setProperty('--preview-x', (left - box.left) + 'px');
        media.style.setProperty('--preview-y', (y - box.top) + 'px');
        media.style.setProperty('--preview-scale', scale);
        media.querySelector('button').setAttribute('aria-expanded', 'true');
        media.classList.add('is-expanded');
        expanded = media;
    }

    mediaItems.forEach(media => {
        const asset = media.querySelector('.publication-image');
        if (!asset) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'publication-preview';
        button.setAttribute('aria-expanded', 'false');
        asset.replaceWith(button);
        button.append(asset);

        media.addEventListener('pointerenter', event => {
            if (event.pointerType === 'mouse') openPreview(media);
        });
        media.addEventListener('pointerleave', event => {
            if (event.pointerType === 'mouse' && expanded === media) closePreview();
        });
        button.addEventListener('focus', () => {
            if (button.matches(':focus-visible')) openPreview(media);
        });
        button.addEventListener('blur', () => {
            if (expanded === media) closePreview();
        });
        button.addEventListener('click', () => {
            if (expanded === media) closePreview();
            else openPreview(media);
        });
    });

    document.addEventListener('pointerdown', event => {
        if (expanded && !expanded.contains(event.target)) closePreview();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closePreview();
    });
    window.addEventListener('scroll', closePreview, { passive: true });
    window.addEventListener('resize', closePreview);
}

function initPublicationVideos() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    document.querySelectorAll('video.publication-image[data-src]').forEach(video => {
        let inView = false;
        let playRequested = false;

        function updatePlayback() {
            const allowAutoplay = !reducedMotion.matches && !navigator.connection?.saveData;
            if (document.hidden || !inView || !(playRequested || allowAutoplay)) {
                video.pause();
                return;
            }
            if (!video.hasAttribute('src')) video.src = video.dataset.src;
            video.play().catch(() => {}); // Browsers can require a tap to start inline playback.
        }

        video.closest('button').addEventListener('click', () => {
            playRequested = true;
            updatePlayback();
        });
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(([entry]) => {
                inView = entry.isIntersecting;
                updatePlayback();
            });
            observer.observe(video.closest('.publication-media'));
        } else {
            inView = true;
            updatePlayback();
        }
        reducedMotion.addEventListener('change', updatePlayback);
        document.addEventListener('visibilitychange', updatePlayback);
    });
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Theme
    const savedTheme = localStorage.getItem(CONFIG.themeKey) || 'light';
    setTheme(savedTheme);
    
    // 2. Initialize Language
    const savedLang = localStorage.getItem(CONFIG.langKey) || 'en';
    initPublicationPreviews();
    setLanguage(savedLang);
    initPublicationVideos();
    
    // 3. Bind Events
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) langBtn.addEventListener('click', toggleLanguage);
    
    // 4. Other Features
    initNewsScroll();
    initVisitCounter();
    initGitHubStats();
});
