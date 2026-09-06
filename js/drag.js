document.querySelectorAll('.drag').forEach(slider => {
    let isDown = false;
    let startX, scrollLeft;
    let isDragging = false;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false;
        
        slider.style.scrollSnapType = 'none';
        slider.style.scrollBehavior = 'auto';
        slider.classList.add('active');

        startX = e.pageX;
        scrollLeft = slider.scrollLeft;
    });

    const stopDrag = () => {
        if (!isDown) return;
        isDown = false;
        slider.classList.remove('active');

        slider.style.scrollSnapType = 'x mandatory';
        slider.style.scrollBehavior = 'smooth';
    };

    slider.addEventListener('mouseleave', stopDrag);
    slider.addEventListener('mouseup', stopDrag);

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();

        const x = e.pageX;
        const walk = x - startX;

        if (Math.abs(walk) > 5) {
            isDragging = true;
        }

        slider.scrollLeft = scrollLeft - walk;
    });

    slider.addEventListener('click', (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
});