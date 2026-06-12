// ワンページ・スクロール遷移
document.addEventListener('DOMContentLoaded', function () {

    // 読み進みバー
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const h = document.documentElement;
            bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
            ticking = false;
        });
    }, { passive: true });

    // スクロールリビール
    const reveal = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-in');
                reveal.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => reveal.observe(el));

    // スクロールスパイ — ナビの現在地ハイライト
    const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'))
        .filter(a => a.getAttribute('href') !== '#top');
    const sections = navLinks
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    const spy = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navLinks.forEach(a =>
                    a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id)
                );
            }
        });
    }, { rootMargin: '-25% 0px -65% 0px' });
    sections.forEach(s => spy.observe(s));
});
