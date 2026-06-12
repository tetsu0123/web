// 作品ページ: トップと同じスクロールリビール
document.addEventListener('DOMContentLoaded', function () {
    const targets = document.querySelectorAll('main h1, main .hero, main .section');
    targets.forEach(el => el.setAttribute('data-reveal', ''));

    const reveal = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-in');
                reveal.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    targets.forEach(el => reveal.observe(el));
});
