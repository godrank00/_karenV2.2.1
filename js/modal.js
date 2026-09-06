document.addEventListener('click', function (event) {
    const modalContainer = document.querySelector('.modal-container');
    const modalCheckbox = document.getElementById('modal-toggle');

    if (!modalCheckbox.checked) return; // اگه منو بسته‌ست کاری نکن

    const clickedInsideModal = modalContainer.contains(event.target);

    if (!clickedInsideModal) {
        modalCheckbox.checked = false;
    }
});