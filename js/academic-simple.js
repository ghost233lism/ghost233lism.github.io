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
    } else if (path.includes('my-company')) {
        title = lang === 'en' ? 'Shitu Xunjing | Jin Modi' : '识图寻境 | 金莫迪';
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

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Theme
    const savedTheme = localStorage.getItem(CONFIG.themeKey) || 'light';
    setTheme(savedTheme);
    
    // 2. Initialize Language
    const savedLang = localStorage.getItem(CONFIG.langKey) || 'en';
    setLanguage(savedLang);
    
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
