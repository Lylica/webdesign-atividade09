// =========================================================
// 1. VARIÁVEIS E FUNÇÕES GLOBAIS
// =========================================================
const bottomBar = document.querySelector('.bottombar span');
const fileLinks = document.querySelectorAll('.file-link, .folder-header');
const page = document.documentElement.dataset.page;
const contentTitle = document.querySelector('#main-title');
const contentSections = document.querySelectorAll('.content-section');
let currentActiveLink = null; 
let currentContentSection = document.querySelector('.content-section.active'); // conteúdo inicial
const toggle = document.getElementById('theme-toggle'); // slide switch

// =========================================================
// 2. FUNÇÃO: Atualiza a barra de status inferior
// =========================================================
function updateStatus(message) {
    if (bottomBar) {
        bottomBar.textContent = `Status: ${message}`;
    }
}

// =========================================================
// 3. FUNÇÃO: Alterna a visibilidade do conteúdo no HTML
// =========================================================
function switchContent(contentId, newLink) {
    // Esconde a seção atual
    if (currentContentSection) {
        currentContentSection.classList.remove('active');
        currentContentSection.setAttribute('hidden', '');
    }

    // Mostra a nova seção
    const newSection = document.querySelector(`#${contentId}`);
    if (newSection) {
        newSection.classList.add('active');
        newSection.removeAttribute('hidden');
        currentContentSection = newSection;

        // Atualiza título
        const sectionTitle = newSection.querySelector('h1')?.textContent || '';
        if (contentTitle) contentTitle.textContent = sectionTitle;

        // Atualiza status
        const statusMessage = newLink.dataset.status || `Editando arquivo: ${newLink.querySelector('.file-name')?.textContent || ''}`;
        updateStatus(statusMessage);

        // Scroll suave para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        updateStatus(`Erro: Conteúdo '${contentId}' não encontrado.`);
    }
}

// =========================================================
// 4. FUNÇÃO: Gerencia estado ativo do link na sidebar
// =========================================================
function setActiveLink(newLink) {
    if (currentActiveLink) currentActiveLink.classList.remove('active');
    newLink.classList.add('active');
    currentActiveLink = newLink;
}

// =========================================================
// 5. FUNÇÃO: Gerencia clique em pastas/links com data-href
// =========================================================
function handleFolderClick(header) {
    const folder = header.closest(".folder");
    const href = header.dataset.href;
    if (!href) return;

    // Efeito visual
    folder.classList.toggle("open");
    const arrow = folder.querySelector(".folder-arrow");
    if (arrow) arrow.classList.toggle("rotated");

    // Fade-out em outros itens
    document.querySelectorAll(".folder, .file").forEach(item => {
        if (item !== folder) item.classList.toggle("fade-out");
    });

    // Navegação com delay para efeito visual
    setTimeout(() => {
        window.location.href = href;
    }, 300);
}

// =========================================================
// 6. INICIALIZAÇÃO E EVENT LISTENERS
// =========================================================
function initVSLearn() {

    // --- Tema claro/escuro persistente ---
    if (toggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            toggle.checked = true;
        }

        toggle.addEventListener('change', () => {
            document.body.classList.toggle('light-theme', toggle.checked);
            localStorage.setItem('theme', toggle.checked ? 'light' : 'dark');
        });
    }

    // --- Inicializa link ativo e título ---
    if (page === 'html') {
        const initialLink = document.querySelector('.file-link.active');
        if (initialLink) {
            currentActiveLink = initialLink;
            const initialSection = document.querySelector(`#${initialLink.dataset.contentId}`);
            if (initialSection) {
                const sectionTitle = initialSection.querySelector('h1')?.textContent || '';
                if (contentTitle) contentTitle.textContent = sectionTitle;
            }
            const statusMessage = initialLink.dataset.status || `Editando arquivo: ${initialLink.querySelector('.file-name')?.textContent || ''}`;
            updateStatus(statusMessage);
        }
    }

    // --- Eventos para links e pastas ---
    fileLinks.forEach(link => {

        // Clique
        link.addEventListener("click", (e) => {
            if (link.tagName === 'A') return; // ignora links externos

            // Se for pasta
            if (link.classList.contains('folder-header')) {
                e.preventDefault();
                handleFolderClick(link);
                return;
            }

            // Se for subitem de conteúdo
            const contentId = link.dataset.contentId;
            if (contentId) {
                e.preventDefault();
                setActiveLink(link);
                switchContent(contentId, link);
            }
        });

        // Hover: atualiza status bar
        link.addEventListener('mouseover', () => {
            const statusMessage = link.dataset.status || `Visualizando: ${link.querySelector('.file-name')?.textContent || ''}`;
            updateStatus(statusMessage); 
        });

        link.addEventListener('mouseout', () => {
            if (currentActiveLink) {
                const currentStatus = currentActiveLink.dataset.status || `Editando arquivo: ${currentActiveLink.querySelector('.file-name')?.textContent || ''}`;
                updateStatus(currentStatus);
            } else {
                updateStatus('Pronto');
            }
        });
    });

    // --- Sombra na topbar ao scroll ---
    window.addEventListener('scroll', () => {
        const topbar = document.querySelector('.topbar');
        if (window.scrollY > 5) {
            topbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.4)';
        } else {
            topbar.style.boxShadow = 'none';
        }
    });

    // --- Reload se usuário voltar pelo histórico ---
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) window.location.reload();
    });
}

// =========================================================
// 7. INICIA APLICAÇÃO
// =========================================================
document.addEventListener("DOMContentLoaded", initVSLearn);
