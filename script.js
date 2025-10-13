// Destacar automaticamente o arquivo ativo baseado na URL
const sidebarFiles = document.querySelectorAll('.sidebar li');

sidebarFiles.forEach(file => {
    const link = file.querySelector('a');
    if (link.href === window.location.href) {
        file.classList.add('active');
    } else {
        file.classList.remove('active');
    }
});
