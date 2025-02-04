document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menu-icon');
    const menuPopup = document.getElementById('menu-popup');

    if (menuIcon && menuPopup) {
        menuIcon.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the event from bubbling up to the document
            menuPopup.style.display = (menuPopup.style.display === 'flex' ? 'none' : 'flex');
        });

        document.addEventListener('click', function(event) {
            if (!menuPopup.contains(event.target) && event.target !== menuIcon) {
                menuPopup.style.display = 'none';
            }
        });
    }
});