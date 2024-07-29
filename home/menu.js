document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menu-icon');
    const menu = document.getElementById('menu');
    const overlay = document.getElementById('overlay');

    menuIcon.addEventListener('click', function() {
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'flex';
            overlay.style.display = 'block';
        } else {
            menu.style.display = 'none';
            overlay.style.display = 'none';
        }
    });

    overlay.addEventListener('click', function() {
        menu.style.display = 'none';
        overlay.style.display = 'none';
    });
});
