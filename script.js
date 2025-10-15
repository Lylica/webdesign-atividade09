// =========================================================
// 1. VARIÁVEIS E FUNÇÕES GLOBAIS (Simplificadas)
// =========================================================
const bottomBar = document.querySelector('.bottombar span');
const fileLinks = document.querySelectorAll('.file-link');
const page = document.documentElement.dataset.page;
const contentTitle = document.querySelector('#main-title');
const contentSections = document.querySelectorAll('.content-section');
let currentActiveLink = null; 
let currentContentSection = document.querySelector('.content-section.active'); // Começa com o primeiro conteúdo visível

// Função: Atualiza o status na barra inferior
function updateStatus(message) {
    if (bottomBar) {
        bottomBar.textContent = `Status: ${message}`;
    }
}

// NOVO EVENTO: Alterna a visibilidade do conteúdo no HTML
function switchContent(contentId, newLink) {
    // 1. Esconde a seção de conteúdo atual
    if (currentContentSection) {
        currentContentSection.classList.remove('active');
        currentContentSection.setAttribute('hidden', '');
    }
    
    // 2. Encontra e mostra a nova seção
    const newSection = document.querySelector(`#${contentId}`);
    if (newSection) {
        newSection.classList.add('active');
        newSection.removeAttribute('hidden');
        currentContentSection = newSection;

        // 3. Atualiza o título e o status
        const sectionTitle = newSection.querySelector('h1').textContent;
        if (contentTitle) contentTitle.textContent = sectionTitle;
        updateStatus(`Editando arquivo: ${newLink.querySelector('.file-name').textContent}`);
    } else {
        updateStatus(`Erro: Conteúdo '${contentId}' não encontrado.`);
    }
}

// Função: Gerencia o estado ativo do link na sidebar
function setActiveLink(newLink) {
    if (currentActiveLink) {
        currentActiveLink.classList.remove('active');
    }
    newLink.classList.add('active');
    currentActiveLink = newLink;
}

// Função: Simulação de animação de pasta
function handleFolderClick(header) {
    const folder = header.closest(".folder");
    const href = header.dataset.href;

    if (page === "index") {
        folder.classList.add("open");
        document.querySelectorAll(".folder, .file")
            .forEach(item => {
                if (item !== folder) item.classList.add("fade-out");
            });

        setTimeout(() => {
            window.location.href = href;
        }, 350);
    } 
    else if (page === "html" && href === 'index.html') {
        folder.classList.remove("open");
        const arrow = folder.querySelector(".folder-arrow");
        arrow.classList.remove("rotated"); 

        setTimeout(() => {
            window.location.href = href;
        }, 300);
    }
}


// =========================================================
// 2. INICIALIZAÇÃO E EVENT LISTENERS
// =========================================================

function initVSLearn() {
    
    // Carrega o link ativo inicial
    if (page === 'html') {
        const initialLink = document.querySelector('.file-link.active');
        if (initialLink) {
            currentActiveLink = initialLink;
            // Atualiza o título e status com base no conteúdo inicial
            const initialSection = document.querySelector(`#${initialLink.dataset.contentId}`);
            if (initialSection) {
                const sectionTitle = initialSection.querySelector('h1').textContent;
                if (contentTitle) contentTitle.textContent = sectionTitle;
            }
            updateStatus(`Editando arquivo: ${initialLink.querySelector('.file-name').textContent}`);
        }
    }
    
    // Loop principal para todos os links na sidebar
    fileLinks.forEach(link => {
        // --- EVENTO: Clique no Link (Alterna conteúdo ou navega) ---
        link.addEventListener("click", (e) => {
            if (link.tagName === 'A') {
                return; 
            }
            
            // Se for um link de pasta
            if (link.classList.contains('folder-header')) {
                e.preventDefault();
                handleFolderClick(link); 
                return;
            }
            
            // Se for um link de subitem de conteúdo (mudança de aba)
            const contentId = link.dataset.contentId;
            if (contentId) {
                e.preventDefault();
                setActiveLink(link);
                switchContent(contentId, link); // NOVO: Troca o conteúdo no HTML
            }
        });
        
        // --- EVENTO EXTRA: Mouseover para Status Bar ---
        link.addEventListener('mouseover', () => {
            const fileName = link.querySelector('.file-name').textContent;
            updateStatus(`Visualizando: ${fileName}`); 
        });
        
        link.addEventListener('mouseout', () => {
            if (currentActiveLink) {
                 const currentFileName = currentActiveLink.querySelector('.file-name').textContent;
                updateStatus(`Editando arquivo: ${currentFileName}`);
            } else {
                 updateStatus('Pronto');
            }
        });
    });

    // --- EVENTO EXTRA: Manipulação de Scroll ---
    window.addEventListener('scroll', () => {
        const topbar = document.querySelector('.topbar');
        if (window.scrollY > 5) {
            topbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.4)';
        } else {
            topbar.style.boxShadow = 'none';
        }
    });
    
    // Garante que, ao voltar pelo navegador, o estado é reiniciado
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            window.location.reload();
        }
    });
}

// Inicia a aplicação
document.addEventListener("DOMContentLoaded", initVSLearn);