# HiveMind Copilot Extension Installation Guide

## 📦 Fresh Installation (v0.2.0)

### Step 1: Uninstall Previous Version
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "HiveMind Copilot"
4. If found, click the gear icon → "Uninstall"
5. **Restart VS Code completely**

### Step 2: Install New Version
1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type: `Extensions: Install from VSIX...`
4. Select the file: `hivemind-copilot-0.2.0.vsix`
5. Click "Install"
6. **Restart VS Code when prompted**

### Step 3: Verify Installation
1. Check the Activity Bar (left sidebar) for HiveMind Copilot icons:
   - 🤖 Agent Marketplace
   - 🛡️ Audit Dashboard  
   - 💰 Transaction Center
   - 💬 Chat

2. Open any folder/workspace in VS Code
3. The extension should activate automatically

## 🔧 Configuration

The extension comes pre-configured with:
- **API URL**: `http://localhost:8000`
- **Hedera Account**: `0.0.6273048`
- **Network**: `testnet`

## 🚀 Testing the Extension

### 1. Start Backend (Required)
```bash
cd /path/to/HIvemindCopilot/hivemind
python -m uvicorn main:app --reload --port 8000
```

### 2. Test Features
1. **Agent Marketplace**: Click "Connect to Hedera" button
2. **Chat**: Type a message and test AI responses
3. **Audit Dashboard**: View sample vulnerabilities
4. **Transaction Center**: View sample transactions (after Hedera connection)

## 🔍 Troubleshooting

### Extension Not Appearing
- Ensure VS Code is completely restarted
- Check VS Code version (requires 1.74.0+)
- Try installing in a clean workspace

### Connection Issues
- Verify backend is running on `http://localhost:8000`
- Check VS Code Developer Console (Help → Toggle Developer Tools)
- Look for error messages in the Console tab

### Configuration Issues
- Go to VS Code Settings (Ctrl+,)
- Search for "hivemind"
- Verify all configuration values are set

## 📋 Version Info
- **Extension Version**: 0.2.0
- **Package Size**: 618.5 KB
- **VS Code Compatibility**: ^1.74.0

## 🆘 Support
If issues persist, check the VS Code Output panel:
1. View → Output
2. Select "HiveMind Copilot" from dropdown
3. Look for error messages and logs
