# Push Verix safely to GitHub (Windows)

The source has been cleaned to remove the exposed API key and local `.env` files.

**Important:** The old local Git commit still contains the secret. Because GitHub rejected that commit, remove the old `.git` history and create a clean repository history before pushing.

Open Command Prompt in this extracted project folder and run:

```bat
rmdir /s /q .git
git init
git branch -M main
git add .
git commit -m "Add Verix project source without secrets"
git remote add origin https://github.com/ananyaagrawal-18/Verix.git
git push -u origin main
```

If `remote origin already exists`, after reinitializing this should not normally happen; if it does, run:
```bat
git remote set-url origin https://github.com/ananyaagrawal-18/Verix.git
git push -u origin main
```

Set your own new API key in `backend/.env` or the project-supported environment file. Never paste API keys into source code or commit `.env` files.
