# CoDrive Mobile Client 📱

React Native mobile application for CoDrive using Expo.

## Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go app on your phone/emulator

## First Time Setup (IMPORTANT!)

### 1. Install Dependencies
```bash
cd mobile-client
npm install
```

### 2. Configure Environment ⚠️
**This is REQUIRED before running!**

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` and set your API URL based on your device:
- **Android Emulator:** `http://10.0.2.2:3000/api`
- **iOS Simulator:** `http://localhost:3000/api`
- **Physical Device:** `http://YOUR_COMPUTER_IP:3000/api`

### 3. Start Development Server
```bash
# Recommended: Clear cache on first run
npx expo start --tunnel -c
```

## 🚨 Common Issues & Solutions

### "Network request failed" Error
**Causes:**
- Web server not running
- Wrong API URL in `.env`
- Missing `.env` file

**Solutions:**
1. Start backend: `cd .. && docker compose up -d`
2. Verify `.env` exists and has correct URL
3. For Android Emulator, MUST use `10.0.2.2` not `localhost`

### After `git pull` or `git merge`
**ALWAYS run this after pulling code:**
```bash
npm install
```

This updates dependencies if `package.json` changed.

### Missing Module Errors
If you see "Cannot find module" errors:
```bash
rm -rf node_modules
rm package-lock.json
npm install
npx expo start -c
```

### For Team Members Cloning Repo
1. Clone repo
2. Run `npm install` in mobile-client folder
3. **Create `.env` from `.env.example`**
4. Update API URL in `.env` for your device
5. Start with `npx expo start --tunnel -c`

## 📂 Important Files (Git Behavior)

### ✅ Committed to Git:
- `package.json` - Dependencies list
- `package-lock.json` - Exact versions
- `.env.example` - Template for configuration
- Source code (`app/`, `components/`, etc.)

### ❌ NOT in Git (in `.gitignore`):
- `.env` - Your personal config (contains local URLs)
- `node_modules/` - Dependencies (too large, regenerate with `npm install`)
- `.expo/` - Build cache

## 🔄 Team Workflow

1. **Before coding:** `git pull` then `npm install`
2. **Adding packages:** Commit both `package.json` AND `package-lock.json`
3. **Sharing config:** Update `.env.example`, not `.env`
4. **After merge conflicts:** Run `npm install` to sync dependencies

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
