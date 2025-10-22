// =========================================================
// 1. VARIÁVEIS GLOBAIS
// =========================================================
const bottomBar = document.querySelector('.bottombar span');
const fileLinks = document.querySelectorAll('.file-link, .folder-header');
const page = document.documentElement.dataset.page;
const contentTitle = document.querySelector('#main-title');
let currentActiveLink = null;
let currentContentSection = document.querySelector('.content-section.active');
const toggle = document.getElementById('theme-toggle');
let editor = null;
let previewTimeout;

// =========================================================
// 2. OBJETO: Gerencia scroll por seção
// =========================================================
const scrollManager = {
    positions: {},
    save(id) { this.positions[id] = window.scrollY; },
    restore(id) { window.scrollTo({ top: this.positions[id] || 0, behavior: 'smooth' }); }
};

// =========================================================
// 3. FUNÇÃO: Atualiza barra de status
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
// 5. FUNÇÃO: Retorna status de link
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
// 7. FUNÇÃO: Alterna conteúdo
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
    setActiveLink(newLink, false);

    scrollManager.restore(newSection.id);
    updateCurrentStatus();

    // Inicializa editor se a seção for ativa e editor ainda não foi criado
    if (contentId === "editor-html" && !editor) initEditor();
}

// =========================================================
// 8. FUNÇÃO: Define link ativo
// =========================================================
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
// 10. FUNÇÃO: Inicializa CodeMirror + preview
// =========================================================
function initEditor() {
    const editorTextarea = document.getElementById("editor-code");
    const preview = document.getElementById("preview");
    if (!editorTextarea || !preview) return;

    const isLight = document.body.classList.contains('light-theme');

    editor = CodeMirror.fromTextArea(editorTextarea, {
        mode: "htmlmixed",
        lineNumbers: true,
        theme: isLight ? "default" : "material-darker",
        lineWrapping: true,
    });

    const updatePreview = () => {
        const base = `<style>
            html, body { background-color:#fff;color:#000;font-family:Arial,sans-serif;margin:0;padding:10px; }
        </style>`;
        preview.srcdoc = base + editor.getValue();
        saveEditorContent(false);
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
// 12. FUNÇÃO: Atualiza contador de linhas
// =========================================================
function updateLineCount() {
    if (!editor) return;
    const lineCount = editor.lineCount();
    bottomBar.textContent = `Linhas: ${lineCount} | ${bottomBar.textContent}`;
}

// =========================================================
// 13. FUNÇÃO: Notificação de AutoSave
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

        // Atalhos para trocar seções rapidamente
        if (e.ctrlKey) {
            switch (e.key) {
                case '1':
                    const link1 = document.querySelector('.file-link[data-content-id="editor-html"]');
                    if (link1) switchContent(link1.dataset.contentId, link1);
                    break;
                // Adicione mais seções se necessário
            }
        }
    });
}

// =========================================================
// 15. FUNÇÃO: Sincroniza tema com o sistema + CodeMirror
// =========================================================
function syncSystemTheme() {
    if (!window.matchMedia) return;

    const applyTheme = (isLight) => {
        document.body.classList.toggle('light-theme', isLight);
        toggle.checked = isLight;
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        if (editor) editor.setOption("theme", isLight ? "default" : "material-darker");
        updateStatus(`Tema alterado para ${isLight ? 'claro' : 'escuro'}`);
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

    if (page === 'editor') {
        const initialLink = document.querySelector('.file-link.active');
        if (initialLink) {
            currentActiveLink = initialLink;
            const initialSection = document.querySelector(`#${initialLink.dataset.contentId}`);
            if (initialSection) currentContentSection = initialSection;
            if (contentTitle && currentContentSection) contentTitle.textContent = currentContentSection.querySelector('h1')?.textContent || '';
            updateCurrentStatus();

            if (initialSection.id === "editor-html") initEditor();
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

    initShortcuts();

    updateStatus('Bem-vindo ao VSLearn!');
    setTimeout(updateCurrentStatus, 2000);
}

// =========================================================
// 19. INICIALIZAÇÃO AO CARREGAR A PÁGINA
// =========================================================
document.addEventListener("DOMContentLoaded", initVSLearn);

// =========================================================
// 20. BOTÃO MENU MOBILE
// =========================================================
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');

menuToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});
