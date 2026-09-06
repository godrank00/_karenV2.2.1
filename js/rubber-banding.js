const container = document.querySelector('.rubber');
const firstItem = container.firstElementChild;
const lastItem = container.lastElementChild;

let startX = 0;
let isDragging = false;

container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
}, { passive: true });

container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const distance = currentX - startX;

    // گرفتن موقعیت زنده اولین و آخرین آیتم نسبت به کانتینر
    const containerRect = container.getBoundingClientRect();
    const firstRect = firstItem.getBoundingClientRect();
    const lastRect = lastItem.getBoundingClientRect();

    // رسیدن به ته چپ یا ته راست بر اساس موقعیت فیزیکی عناصر
    const isAtRightEnd = firstRect.right <= containerRect.right + 5;
    const isAtLeftEnd = lastRect.left >= containerRect.left - 5;

    if ((isAtRightEnd && distance < 0) || (isAtLeftEnd && distance > 0)) {
        const pull = Math.sign(distance) * Math.pow(Math.abs(distance), 0.7);
        container.style.transform = `translateX(${pull}px)`;
        container.style.transition = 'none';
    }
}, { passive: true });

container.addEventListener('touchend', () => {
    isDragging = false;
    container.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    container.style.transform = 'translateX(0)';
});