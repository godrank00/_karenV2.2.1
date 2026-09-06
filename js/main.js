window.addEventListener('click', function (e) {
    const glow = document.createElement('div');
    glow.className = 'global-glow';

    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';

    document.body.appendChild(glow);

    setTimeout(() => {
        glow.remove();
    }, 450);
});


window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  if (loader) {
    loader.classList.add("fade-out");
  }
});