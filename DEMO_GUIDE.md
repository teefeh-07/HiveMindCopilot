# 🧠 HiveMind Copilot - Demo Guide

## 🎬 Demo Recording Setup

### VS Code Extension Demo
1. **Open VS Code** in the project directory
2. **Press `Cmd+Shift+P`** to open Command Palette
3. **Type: `HiveMind: Open HiveMind Copilot`**
4. **Press Enter** to open the interactive panel
5. **Click on feature cards** to demonstrate:
   - 💬 AI Chat Interface
   - ✨ Code Generation
   - 🔍 Code Analysis
   - 🛡️ Security Audit
   - ⚙️ Contract Compilation
   - 📚 Documentation Search

### 🚀 Backend Requirements
- **Backend API**: Must be running on `http://localhost:8000`
- **Start backend**:
  ```bash
  cd hivemind
  python -m uvicorn main:app --reload --port 8000
  ```

### 📦 Clean Project Structure
```
HIvemindCopilot/
├── hivemind/           # Backend API server
├── hivemind-clean/     # Clean VS Code extension (v0.3.0)
├── docs/              # Documentation
├── utils/             # Utility scripts
├── deploy.py          # Deployment script
└── DEMO_GUIDE.md      # This guide
```

### ✅ Extension Installation
The clean extension (v0.3.0) is already installed. To reinstall:
```bash
cd hivemind-clean
code --install-extension hivemind-copilot-0.3.0.vsix --force
```

### 🎮 Available Command (Only One!)
- **`HiveMind: Open HiveMind Copilot`** - Opens the interactive panel

### 🎯 Demo Flow
1. **Start backend server** - Show API running on localhost:8000
2. **Open VS Code** - Show clean interface
3. **Open Command Palette** - `Cmd+Shift+P`
4. **Run HiveMind command** - Show single clean command
5. **Demonstrate each feature**:
   - Click **Chat** - Ask AI questions
   - Click **Generate** - Generate smart contract code
   - Click **Analyze** - Analyze code quality
   - Click **Audit** - Security vulnerability scan
   - Click **Compile** - Compile Solidity contracts
   - Click **Docs** - Search documentation

### ✨ Key Demo Points
- **Single command** - No confusion, just one entry point
- **Interactive UI** - Click cards to access features
- **Real backend integration** - Live API calls to localhost:8000
- **All 6 AI features** - Complete development toolkit
- **Clean & professional** - No old interfaces or clutter

### 🔧 API Endpoints Used
- `/api/v1/chat` - AI conversations
- `/api/v1/generate` - Code generation
- `/api/v1/analyze` - Code analysis
- `/api/v1/audit` - Security auditing
- `/api/v1/compile` - Contract compilation
- `/api/v1/docs` - Documentation search

---
**🎥 Ready for demo recording with clean, professional interface!**
