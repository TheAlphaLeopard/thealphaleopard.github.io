document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menu-icon');
    const menuPopup = document.getElementById('menu-popup');

    menuIcon.addEventListener('click', function() {
        if (menuPopup.style.display === 'none' || menuPopup.style.display === '') {
            menuPopup.style.display = 'flex';
        } else {
            menuPopup.style.display = 'none';
        }
    });
});
