// =========================================================
// 1. VARIÁVEIS GLOBAIS
// =========================================================
const bottomBar = document.querySelector('.bottombar span'); // Barra de status inferior
const fileLinks = document.querySelectorAll('.file-link, .folder-header'); // Todos os links de arquivo e pastas
const page = document.documentElement.dataset.page; // Página atual
const contentTitle = document.querySelector('#main-title'); // Título do conteúdo ativo
let currentActiveLink = null; // Link ativo
let currentContentSection = document.querySelector('.content-section.active'); // Seção ativa
const toggle = document.getElementById('theme-toggle'); // Toggle de tema
let editor = null; // Instância do CodeMirror
let previewTimeout; // Timeout para atualização do preview

// =========================================================
// 2. OBJETO: Gerencia scroll por seção
// =========================================================
const scrollManager = {
    positions: {},
    /**
     * Salva a posição do scroll de uma seção
     * @param {string} id - ID da seção
     */
    save(id) { this.positions[id] = window.scrollY; },
    /**
     * Restaura a posição do scroll de uma seção
     * @param {string} id - ID da seção
     */
    restore(id) { window.scrollTo({ top: this.positions[id] || 0, behavior: 'smooth' }); }
};

// =========================================================
// 3. FUNÇÃO: Atualiza a barra de status
// =========================================================
function updateStatus(message, type = 'info') {
    if (!bottomBar) return;
    bottomBar.textContent = `Status: ${message}`;
    bottomBar.className = `status-${type}`;
}

// =========================================================
// 4. FUNÇÃO: Logging para debug
// =========================================================
function debugLog(message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[VSLearn | ${timestamp}] ${message}`, data || '');
}

// =========================================================
// 5. FUNÇÃO: Retorna o status de um link
// =========================================================
function getLinkStatus(link) {
    if (!link) return 'Pronto';
    return link.dataset.status || `Editando arquivo: ${link.querySelector('.file-name')?.textContent || ''}`;
}

// =========================================================
// 6. FUNÇÃO: Atualiza status do link ou seção ativa
// =========================================================
function updateCurrentStatus() {
    if (currentContentSection) {
        const title = currentContentSection.querySelector('h1')?.textContent || currentContentSection.id;
        updateStatus(`Seção ativa: ${title}`);
    } else if (currentActiveLink) {
        updateStatus(getLinkStatus(currentActiveLink));
    } else {
        updateStatus('Pronto');
    }
}

// =========================================================
// 7. FUNÇÃO: Alterna a visibilidade do conteúdo
// =========================================================
function switchContent(contentId, newLink) {
    if (currentContentSection) {
        scrollManager.save(currentContentSection.id);
        currentContentSection.classList.remove('active');
        currentContentSection.setAttribute('hidden', '');
    }

    const newSection = document.querySelector(`#${contentId}`);
    if (!newSection) return updateStatus(`Erro: Conteúdo '${contentId}' não encontrado.`, 'error');

    newSection.classList.add('active');
    newSection.removeAttribute('hidden');
    currentContentSection = newSection;

    if (contentTitle) contentTitle.textContent = newSection.querySelector('h1')?.textContent || '';

    setActiveLink(newLink, false); // Não atualiza status aqui, será feito no final
    scrollManager.restore(newSection.id);
    updateCurrentStatus(); // Atualiza apenas uma vez
}

// =========================================================
// 8. FUNÇÃO: Define link ativo
// =========================================================
/**
 * Define um link como ativo
 * @param {HTMLElement} newLink - Novo link ativo
 * @param {boolean} updateStatusFlag - Se true, atualiza status imediatamente
 */
function setActiveLink(newLink, updateStatusFlag = true) {
    if (currentActiveLink) currentActiveLink.classList.remove('active');
    newLink?.classList.add('active');
    currentActiveLink = newLink;
    if (updateStatusFlag) updateCurrentStatus();
}

// =========================================================
// 9. FUNÇÃO: Gerencia clique em pastas
// =========================================================
function handleFolderClick(header) {
    const folder = header.closest(".folder");
    const href = header.dataset.href;
    if (!href) return;

    folder.classList.toggle("open");
    const arrow = folder.querySelector(".folder-arrow");
    if (arrow) arrow.classList.toggle("rotated");

    document.querySelectorAll(".folder, .file").forEach(item => {
        if (item !== folder) item.classList.toggle("fade-out");
    });

    setTimeout(() => { window.location.href = href; }, 300);
}

// =========================================================
// 10. FUNÇÃO: Inicializa editor CodeMirror + preview
// =========================================================
function initEditor() {
    const editorTextarea = document.getElementById("editor-code");
    const preview = document.getElementById("preview");
    if (!editorTextarea || !preview) return;

    editor = CodeMirror.fromTextArea(editorTextarea, {
        mode: "htmlmixed",
        lineNumbers: true,
        theme: "material-darker",
        lineWrapping: true,
    });

    const updatePreview = () => {
        const base = `<style>
            html, body { background-color:#fff;color:#000;font-family:Arial,sans-serif;margin:0;padding:10px; }
        </style>`;
        preview.srcdoc = base + editor.getValue();
        saveEditorContent(false); // false para não duplicar status
        debugLog('AutoSave executado');
        updateLineCount();
    };

    editor.on("change", () => {
        clearTimeout(previewTimeout);
        previewTimeout = setTimeout(updatePreview, 500);
    });

    updatePreview();
    focusEditor();
    updateStatus("Editor em tempo real");
    debugLog('Editor inicializado');
}

// =========================================================
// 11. FUNÇÃO: Salva conteúdo do editor
// =========================================================
function saveEditorContent(showStatus = true) {
    if (!editor) return;
    localStorage.setItem('vslearn-editor-content', editor.getValue());
    if (showStatus) showAutoSaveNotice();
}

// =========================================================
// 12. FUNÇÃO: Atualiza contador de linhas do editor
// =========================================================
function updateLineCount() {
    if (!editor) return;
    const lineCount = editor.lineCount();
    bottomBar.textContent = `Linhas: ${lineCount} | ${bottomBar.textContent}`;
}

// =========================================================
// 13. FUNÇÃO: Notificação rápida de AutoSave
// =========================================================
function showAutoSaveNotice() {
    updateStatus('Alterações salvas automaticamente');
    setTimeout(updateCurrentStatus, 2000);
}

// =========================================================
// 14. FUNÇÃO: Inicializa teclas de atalho
// =========================================================
function initShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (!editor) return;

        if (e.ctrlKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            saveEditorContent();
            updateStatus('Arquivo salvo via Ctrl+S');
            debugLog('Arquivo salvo (Ctrl+S)');
        }

        if (e.ctrlKey && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            editor.undo();
            updateStatus('Undo realizado');
        }

        if (e.ctrlKey && e.key.toLowerCase() === 'y') {
            e.preventDefault();
            editor.redo();
            updateStatus('Redo realizado');
        }

        if (e.ctrlKey) {
            switch (e.key) {
                case '1':
                    const link1 = document.querySelector('.file-link[data-content-id="html-section"]');
                    if (link1) switchContent(link1.dataset.contentId, link1);
                    break;
                case '2':
                    const link2 = document.querySelector('.file-link[data-content-id="css-section"]');
                    if (link2) switchContent(link2.dataset.contentId, link2);
                    break;
            }
        }
    });
}

// =========================================================
// 15. FUNÇÃO: Sincroniza tema com o sistema
// =========================================================
function syncSystemTheme() {
    if (!window.matchMedia) return;

    const applyTheme = (isLight) => {
        document.body.classList.toggle('light-theme', isLight);
        toggle.checked = isLight;
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateStatus(`Tema do sistema alterado para ${isLight ? 'light' : 'dark'}`);
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) applyTheme(savedTheme === 'light');
    else if (window.matchMedia('(prefers-color-scheme: light)').matches) applyTheme(true);

    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => applyTheme(e.matches));

    toggle?.addEventListener('change', () => applyTheme(toggle.checked));
}

// =========================================================
// 16. FUNÇÃO: Tooltips rápidos
// =========================================================
document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseover', () => updateStatus(el.dataset.tooltip));
    el.addEventListener('mouseout', updateCurrentStatus);
});

// =========================================================
// 17. FUNÇÃO: Foco no editor
// =========================================================
function focusEditor() { if (editor) editor.focus(); }

// =========================================================
// 18. FUNÇÃO: Inicialização geral do site
// =========================================================
function initVSLearn() {
    syncSystemTheme();

    if (page === 'html' || page === 'editor') {
        const initialLink = document.querySelector('.file-link.active');
        if (initialLink) {
            currentActiveLink = initialLink;
            const initialSection = document.querySelector(`#${initialLink.dataset.contentId}`);
            if (initialSection) currentContentSection = initialSection;
            if (contentTitle && currentContentSection) contentTitle.textContent = currentContentSection.querySelector('h1')?.textContent || '';
            updateCurrentStatus();
        }
    }

    fileLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            if (link.tagName === 'A') return;
            if (link.classList.contains('folder-header')) { e.preventDefault(); handleFolderClick(link); return; }
            const contentId = link.dataset.contentId;
            if (contentId) { e.preventDefault(); switchContent(contentId, link); }
        });

        link.addEventListener('mouseover', () => updateStatus(getLinkStatus(link)));
        link.addEventListener('mouseout', updateCurrentStatus);
    });

    window.addEventListener('scroll', () => {
        const topbar = document.querySelector('.topbar');
        if (topbar) topbar.style.boxShadow = window.scrollY > 5 ? '0 2px 5px rgba(0,0,0,0.4)' : 'none';
    });

    window.addEventListener("pageshow", (event) => { if (event.persisted) window.location.reload(); });

    initEditor();
    initShortcuts();

    updateStatus('Bem-vindo ao VSLearn!');
    setTimeout(updateCurrentStatus, 2000);
}

// =========================================================
// 19. INICIALIZAÇÃO AO CARREGAR A PÁGINA
// =========================================================
document.addEventListener("DOMContentLoaded", initVSLearn);
