# 🧠 HiveMind Copilot

**AI-powered development environment for Hedera blockchain smart contract development.**

## ✨ Features

- **💬 AI Chat Interface** - Interactive AI assistant for Solidity and Hedera development
- **✨ Code Generation** - Generate smart contracts from natural language descriptions
- **🔍 Code Analysis** - Analyze code quality and generate comprehensive tests
- **🛡️ Security Audit** - AI-powered security vulnerability detection
- **⚙️ Contract Compilation** - Compile and optimize Solidity contracts
- **📚 Documentation Search** - AI-powered search through development documentation

## 🚀 Getting Started

### Prerequisites
- VS Code 1.60.0 or higher
- HiveMind backend API running on `http://localhost:8000`

### Installation
1. Install the extension via VSIX file
2. Start your backend server:
   ```bash
   cd hivemind
   python -m uvicorn main:app --reload --port 8000
   ```

### Usage
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type `HiveMind: Open HiveMind Copilot`
3. Click on any feature card to start using the AI tools

## 🎯 Interactive Features

Each feature opens an interactive panel where you can:
- **Chat with AI** about blockchain development
- **Generate code** from descriptions
- **Analyze existing code** for quality and security
- **Audit smart contracts** for vulnerabilities
- **Compile contracts** with optimization options
- **Search documentation** with AI assistance

## 🔧 Backend Connection

The extension connects to your local HiveMind API server at `http://localhost:8000` and uses these endpoints:
- `/api/v1/chat` - AI conversations
- `/api/v1/generate` - Code generation
- `/api/v1/analyze` - Code analysis
- `/api/v1/audit` - Security auditing
- `/api/v1/compile` - Contract compilation
- `/api/v1/docs` - Documentation search

---

**Made for the Hedera developer community** 🚀
