// theme.js
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('spaceminds-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        updateToggleIcons('dark');
    }

    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('spaceminds-theme', isLight ? 'light' : 'dark');
            updateToggleIcons(isLight ? 'dark' : 'light');
        });
    });

    function updateToggleIcons(mode) {
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.innerHTML = mode === 'light' ? '☀️' : '🌙';
        });
    }
});
