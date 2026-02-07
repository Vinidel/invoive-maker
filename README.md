# Gerador de Faturas (Electron)

Aplicativo desktop local para criar faturas com pré-visualização em tempo real, catálogo de serviços e exportação para PDF.

## Recursos
- Interface em português (pt-BR)
- Fatura com pré-visualização ao vivo
- Catálogo de serviços reutilizável
- Configurações da empresa (logo + dados)
- Exportação em PDF
- Tudo local (sem servidor)

## Requisitos
- Node.js 18+ recomendado

## Como rodar
```bash
npm install
npm start
```

## Estrutura
- `main.js` - Processo principal do Electron
- `preload.js` - API segura para renderer
- `renderer.html` - UI principal
- `renderer.js` - Lógica da interface
- `styles.css` - Estilos

## Logo padrão
Coloque a imagem em `assets/logo.png`. O app também permite trocar o logo pelo menu de Configurações.

## Build (opcional)
Ainda não configurado. Se quiser empacotar (Windows/macOS/Linux), posso adicionar Electron Builder.

---
Se quiser personalizar a fatura (campos, layout, cores), é só pedir.
