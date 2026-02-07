# Processo de Release (Automático)

Este projeto usa GitHub Actions para gerar instaladores de Windows, macOS e Linux sempre que um tag de versão é enviado.

## Passo a passo (Automático)

1. Verifique se tudo está commitado:
```bash
git status
```

2. Crie um tag de versão:
```bash
git tag v0.1.1
```

3. Envie o tag para o GitHub:
```bash
git push origin v0.1.1
```

4. Aguarde o GitHub Actions:
- Acesse a aba **Actions** no GitHub.
- O workflow **Release** irá rodar.
- Ele cria builds para **Windows, macOS e Linux**.

5. Baixe os instaladores:
- Acesse a aba **Releases** no GitHub.
- O release com a versão `v0.1.1` terá os arquivos anexados.

## Passo a passo (Local)

1. Instale as dependências:
```bash
npm install
```

2. Gere o release local:
```bash
npm run dist
```

3. Encontre os arquivos em:
`release/`

## Observações
- Use sempre tags no formato `vX.Y.Z` (ex: `v1.2.3`).
- O build gera os arquivos na pasta `release/`.

