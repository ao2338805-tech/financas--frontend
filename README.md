# UNNA — Finanças Frontend

Projeto Expo React Native (web/mobile) — frontend da aplicação UNNA.

Como salvar no GitHub

1. Instale o Git (Windows): https://git-scm.com/download/win
2. Abra PowerShell na pasta do projeto:

```powershell
cd C:\Users\User\Desktop\financas-main\financas--frontend
```

3. Inicialize o repositório (se ainda não estiver):

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

4a. Criar repositório no GitHub via site: crie um repo e copie a URL HTTPS. Depois rode:

```powershell
git remote add origin https://github.com/<seu-usuario>/<seu-repo>.git
git push -u origin main
```

4b. (Opcional) Usando GitHub CLI (mais simples): instale `gh`, autentique (`gh auth login`) e rode:

```powershell
gh repo create <seu-repo> --public --source=. --remote=origin --push
```

Se ocorrerem erros, cole as mensagens aqui e eu te ajudo a resolver (autenticação, branch errado, permissões, etc.).

Observações de segurança

- Não comprometa tokens, arquivos .env ou credenciais. Adicione estes arquivos ao `.gitignore`.
