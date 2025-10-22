# VSLearn - Simulador de Editor de Código

## Índice

1. [Sobre o Projeto](#sobre-o-projeto)  
2. [Funcionalidades](#funcionalidades)  
   - [Editor de Código](#editor-de-código)  
   - [Navegação por Seções](#navegação-por-seções)  
   - [Tema Claro/Escuro](#tema-clareescuro)  
   - [AutoSave e Status](#autosave-e-status)  
   - [Atalhos de Teclado](#atalhos-de-teclado)  
   - [Tooltips e Feedback](#tooltips-e-feedback)  
   - [Menu Mobile](#menu-mobile)  
3. [Exemplos de Uso](#exemplos-de-uso)  
4. [Estrutura de Arquivos](#estrutura-de-arquivos)  
5. [Como Usar](#como-usar)  
6. [Boas Práticas](#boas-práticas)  
7. [Contribuições](#contribuições)  
8. [Licença](#licença)  

---

## Sobre o Projeto

O **VSLearn** é um simulador de editor de código inspirado no **VSCode**, desenvolvido para aprendizado e prática de **HTML, CSS e JavaScript**.

Ele oferece:

- Editor de código com **preview em tempo real**.  
- Tema claro/escuro sincronizado com o sistema ou configurável manualmente.  
- AutoSave automático e controle de versões simples.  
- Navegação rápida por arquivos e pastas.  
- Atalhos de teclado para produtividade.  
- Interface responsiva, compatível com dispositivos móveis.  
- Feedback visual e tooltips para auxiliar o usuário.  

O objetivo é criar um ambiente de aprendizado próximo de um editor profissional, leve e intuitivo.  

---

## Funcionalidades

### Editor de Código

- Baseado em **CodeMirror**.  
- Suporte a HTML, CSS e JavaScript.  
- Numeração de linhas e contagem de linhas na barra de status.  
- Quebra de linha automática.  
- Preview em tempo real com debounce de 500ms para otimização.  
- AutoSave no **localStorage**, preservando conteúdo entre sessões.  
- Undo/Redo integrado com atalhos de teclado.  
- Tema adaptável entre claro e escuro, sincronizado com o sistema ou manual.  
- Mensagens de status informando alterações, AutoSave e erros.  
- Inicialização automática ao abrir a seção do editor.  
- Compatível com múltiplos navegadores e diferentes resoluções de tela.  
- Atualização automática do preview com estilo base para melhor visualização.  
- Foco automático ao abrir o editor para agilizar a digitação.  
- Suporte a múltiplos arquivos e seções dentro do editor.  
- Possibilidade de expandir para suportar novas linguagens.  
- Integração total com a navegação e seções do projeto.  

### Navegação por Seções

- Links de arquivos e pastas clicáveis para alternar conteúdo.  
- Destaque visual do link ativo e do arquivo em edição.  
- Salva posição de scroll ao alternar seções e restaura ao voltar.  
- Pastas expansíveis com efeito visual e animação suave.  
- Alterna seções sem recarregar a página inteira.  
- Atualiza título principal conforme seção ativa.  
- Feedback visual ao passar o mouse sobre links ou arquivos.  
- Suporte a navegação rápida via teclado (Ctrl+1, Ctrl+2...).  
- Permite organização hierárquica de arquivos e pastas.  
- Compatível com desktop e mobile.  

### Tema Claro/Escuro

- Detecta preferência do sistema automaticamente usando `matchMedia`.  
- Toggle manual para alternar tema pelo usuário.  
- Salva preferência no **localStorage** para persistência.  
- Atualiza editor e página instantaneamente ao trocar tema.  
- Feedback visual na barra de status indicando o tema atual.  
- Funciona tanto em desktop quanto em dispositivos móveis.  
- Suporta mudanças dinâmicas de tema sem reiniciar o editor.  
- Mantém consistência entre editor, barra de status e interface.  

### AutoSave e Status

- Salva automaticamente conteúdo do editor a cada alteração.  
- Mensagem temporária de AutoSave visível por 2 segundos.  
- Barra de status exibe mensagens contextuais como:  
  - “Pronto”  
  - “Seção ativa: [nome]”  
  - “Arquivo salvo automaticamente”  
- Atualiza status ao passar mouse sobre links ou tooltips.  
- Mantém histórico de AutoSave no localStorage.  
- Evita perda de conteúdo ao fechar o navegador.  
- Mensagens de erro caso falha no salvamento.  
- Integração com contador de linhas do editor.  

### Atalhos de Teclado

- Ctrl+S: salvar conteúdo do editor.  
- Ctrl+Z / Ctrl+Y: desfazer/refazer alterações.  
- Ctrl+1, 2, 3...: alternar rapidamente entre seções.  
- Feedback visual na barra de status ao usar atalhos.  
- Evita comportamento padrão do navegador, garantindo produtividade.  
- Funciona mesmo com tema alterado.  
- Facilita a navegação rápida entre arquivos e seções.  

### Tooltips e Feedback

- Exibe tooltip ao passar o mouse em elementos com `data-tooltip`.  
- Atualiza status com mensagem do tooltip.  
- Reseta status ao remover o mouse.  
- Mensagens rápidas e contextualizadas para o usuário.  
- Integração completa com barra de status.  
- Fácil de adicionar em novos elementos do HTML.  
- Auxilia usuários iniciantes a entender funcionalidades.  

### Menu Mobile

- Sidebar responsivo com toggle.  
- Botão de menu acessível e visível em telas pequenas.  
- Permite navegação rápida em dispositivos móveis.  
- Integração com tooltips, status e tema claro/escuro.  
- Animação suave ao abrir/fechar menu.  
- Mantém links de navegação funcionais sem interferir no conteúdo.  

---

## Exemplos de Uso

- Abrir editor HTML e digitar código para ver preview instantâneo.  
- Alternar tema manualmente usando o toggle.  
- Salvar alterações com Ctrl+S e verificar AutoSave na barra de status.  
- Alternar seções rapidamente com Ctrl+1, Ctrl+2.  
- Expandir pastas para acessar arquivos internos.  
- Visualizar tooltips para entender a função de cada botão ou link.  
- Testar navegação em mobile com menu lateral toggle.  
- Alterar código e observar atualização automática no preview.  
- Usar undo/redo para corrigir alterações.  
- Trabalhar em múltiplas seções mantendo posição de scroll.  

---

## Estrutura de Arquivos


- **index.html**: página principal e navegação.  
- **style.css**: estilos gerais, tema claro/escuro e responsividade.  
- **script.js**: funcionalidades do editor, navegação, atalhos e status.  
- **assets/**: ícones, imagens e recursos estáticos.  
- **editor/**: editor de código e preview.  
- **lib/codemirror/**: biblioteca CodeMirror local.  

---

## Como Usar

1. Abra `index.html` no navegador.  
2. Navegue entre seções pelo sidebar.  
3. Abra a seção do editor para começar a digitar.  
4. Visualize o preview em tempo real.  
5. Use atalhos de teclado para salvar e navegar rapidamente.  
6. Alterne o tema manualmente ou deixe automático.  
7. Conteúdo é salvo automaticamente no localStorage.  
8. Explore diferentes seções HTML, CSS e JS.  
9. Use tooltips para entender cada funcionalidade.  
10. Teste em desktop e dispositivos móveis.  

---

## Boas Práticas

- Manter código organizado e documentado.  
- Salvar frequentemente alterações importantes.  
- Testar funcionalidades após alterações no script.js.  
- Evitar remover classes ou IDs essenciais do HTML.  
- Usar nomes de arquivos claros para navegação intuitiva.  
- Testar compatibilidade em diferentes navegadores.  
- Evitar conflitos de CSS entre seções.  
- Garantir responsividade em telas pequenas e grandes.  
- Seguir padrão de nomenclatura consistente em JavaScript.  
- Documentar alterações para facilitar contribuições futuras.  

---

## Contribuições

- Abrir issues para bugs ou sugestões.  
- Criar pull requests com melhorias.  
- Adicionar novos atalhos, seções ou funcionalidades.  
- Testar funcionalidades antes de enviar pull requests.  
- Manter código limpo, consistente e documentado.  
- Respeitar estilo de codificação existente.  
- Priorizar experiência do usuário final.  
- Melhorar acessibilidade e responsividade sempre que possível.  

---

## Licença

Projeto sob licença **MIT**, permitindo uso, cópia e modificação, desde que seja mantido o aviso de copyright.
