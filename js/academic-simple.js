// Academic Minimalist JavaScript

// Global state
const CONFIG = {
    themeKey: 'theme',
    langKey: 'language',
    visitCountKey: 'visitCount'
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
        title = lang === 'en' ? 'My Company | Jin Modi' : '我的公司 | Jin Modi';
    } else {
        title = lang === 'en' ? 'Jin Modi - Personal Homepage' : 'Jin Modi | 金莫迪';
    }
    document.title = title;
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

// GitHub Stats (Simple implementation)
async function initGitHubStats() {
    const statsElements = document.querySelectorAll('.github-stats[data-repo]');
    
    for (const el of statsElements) {
        const repo = el.getAttribute('data-repo');
        try {
            const res = await fetch(`https://api.github.com/repos/${repo}`);
            if (res.ok) {
                const data = await res.json();
                const starsEl = el.querySelector('[data-type="stars"]');
                const forksEl = el.querySelector('[data-type="forks"]');
                if (starsEl) starsEl.textContent = data.stargazers_count;
                if (forksEl) forksEl.textContent = data.forks_count;
            }
        } catch (e) {
            console.warn('Failed to load GitHub stats for', repo);
        }
    }
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
    initVisitCounter();
    initGitHubStats();
});
