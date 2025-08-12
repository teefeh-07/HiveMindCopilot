import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('HiveMind Copilot is now active!');

    const disposable = vscode.commands.registerCommand('hivemind.openPanel', () => {
        // Create and show webview panel
        const panel = vscode.window.createWebviewPanel(
            'hivemindPanel',
            'HiveMind Copilot',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        // Set webview content
        panel.webview.html = getWebviewContent();

        // Handle messages from webview
        panel.webview.onDidReceiveMessage(
            async (message) => {
                try {
                    const response = await makeApiCall(message.endpoint, message.data);
                    panel.webview.postMessage({
                        command: 'response',
                        type: message.type,
                        data: response
                    });
                } catch (error) {
                    panel.webview.postMessage({
                        command: 'error',
                        type: message.type,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);
}

async function makeApiCall(endpoint: string, data: any) {
    const fetch = require('node-fetch');
    const baseUrl = 'http://localhost:8000';
    
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HiveMind Copilot</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .feature-card {
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .feature-card:hover {
            background: var(--vscode-list-hoverBackground);
            transform: translateY(-2px);
        }
        .feature-card h3 {
            margin-top: 0;
            margin-bottom: 10px;
        }
        .feature-panel {
            display: none;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .feature-panel.active {
            display: block;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 8px 12px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            font-family: inherit;
            font-size: inherit;
        }
        .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }
        .button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
            font-size: inherit;
            margin-right: 10px;
        }
        .button:hover {
            opacity: 0.8;
        }
        .button.secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            background: var(--vscode-textCodeBlock-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            white-space: pre-wrap;
            font-family: var(--vscode-editor-font-family);
            display: none;
        }
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid var(--vscode-panel-border);
            border-radius: 50%;
            border-top-color: var(--vscode-button-background);
            animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 HiveMind Copilot</h1>
            <p>AI-powered development environment for Hedera blockchain</p>
        </div>

        <div class="feature-grid">
            <div class="feature-card" onclick="showFeature('chat')">
                <h3>💬 AI Chat Interface</h3>
                <p>Chat with AI about Solidity contracts and Hedera development</p>
            </div>

            <div class="feature-card" onclick="showFeature('generate')">
                <h3>✨ Code Generation</h3>
                <p>Generate smart contracts and code snippets</p>
            </div>

            <div class="feature-card" onclick="showFeature('analyze')">
                <h3>🔍 Code Analysis</h3>
                <p>Analyze code quality and generate tests</p>
            </div>

            <div class="feature-card" onclick="showFeature('audit')">
                <h3>🛡️ Security Audit</h3>
                <p>Comprehensive security analysis for smart contracts</p>
            </div>

            <div class="feature-card" onclick="showFeature('compile')">
                <h3>⚙️ Contract Compilation</h3>
                <p>Compile and deploy Solidity contracts</p>
            </div>

            <div class="feature-card" onclick="showFeature('docs')">
                <h3>📚 Documentation</h3>
                <p>Search and query development documentation</p>
            </div>
        </div>

        <!-- Feature Panels -->
        <div id="chat-panel" class="feature-panel">
            <h3>💬 AI Chat Interface</h3>
            <div class="form-group">
                <textarea id="chat-input" placeholder="Ask me about Solidity, smart contracts, or Hedera..."></textarea>
            </div>
            <button class="button" onclick="sendChat()">Send Message</button>
            <button class="button secondary" onclick="hideFeatures()">← Back</button>
            <div id="chat-result" class="result"></div>
        </div>

        <div id="generate-panel" class="feature-panel">
            <h3>✨ Code Generation</h3>
            <div class="form-group">
                <label>Code Generation Prompt:</label>
                <textarea id="generate-prompt" placeholder="Describe the code you want to generate..."></textarea>
            </div>
            <div class="form-group">
                <label>Language:</label>
                <select id="generate-language">
                    <option value="solidity">Solidity</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                </select>
            </div>
            <button class="button" onclick="generateCode()">Generate Code</button>
            <button class="button secondary" onclick="hideFeatures()">← Back</button>
            <div id="generate-result" class="result"></div>
        </div>

        <div id="analyze-panel" class="feature-panel">
            <h3>🔍 Code Analysis</h3>
            <div class="form-group">
                <label>Code to Analyze:</label>
                <textarea id="analyze-code" placeholder="Paste your code here..."></textarea>
            </div>
            <div class="form-group">
                <label>Language:</label>
                <select id="analyze-language">
                    <option value="solidity">Solidity</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                </select>
            </div>
            <div class="form-group">
                <label><input type="checkbox" id="generate-tests"> Generate Tests</label>
            </div>
            <button class="button" onclick="analyzeCode()">Analyze Code</button>
            <button class="button secondary" onclick="hideFeatures()">← Back</button>
            <div id="analyze-result" class="result"></div>
        </div>

        <div id="audit-panel" class="feature-panel">
            <h3>🛡️ Security Audit</h3>
            <div class="form-group">
                <label>Smart Contract Code:</label>
                <textarea id="audit-code" placeholder="Paste your Solidity contract here..."></textarea>
            </div>
            <button class="button" onclick="auditContract()">Run Security Audit</button>
            <button class="button secondary" onclick="hideFeatures()">← Back</button>
            <div id="audit-result" class="result"></div>
        </div>

        <div id="compile-panel" class="feature-panel">
            <h3>⚙️ Contract Compilation</h3>
            <div class="form-group">
                <label>Contract Code:</label>
                <textarea id="compile-code" placeholder="Paste your Solidity contract here..."></textarea>
            </div>
            <div class="form-group">
                <label>Contract Name:</label>
                <input type="text" id="contract-name" placeholder="MyContract">
            </div>
            <div class="form-group">
                <label><input type="checkbox" id="optimize"> Enable Optimization</label>
            </div>
            <div class="form-group">
                <label>Optimizer Runs:</label>
                <input type="number" id="optimizer-runs" value="200" min="1">
            </div>
            <button class="button" onclick="compileContract()">Compile Contract</button>
            <button class="button secondary" onclick="hideFeatures()">← Back</button>
            <div id="compile-result" class="result"></div>
        </div>

        <div id="docs-panel" class="feature-panel">
            <h3>📚 Documentation Search</h3>
            <div class="form-group">
                <label>Documentation Query:</label>
                <textarea id="docs-query" placeholder="What would you like to know about?"></textarea>
            </div>
            <div class="form-group">
                <label>Context (optional):</label>
                <textarea id="docs-context" placeholder="Additional context..."></textarea>
            </div>
            <button class="button" onclick="queryDocs()">Search Documentation</button>
            <button class="button secondary" onclick="hideFeatures()">← Back</button>
            <div id="docs-result" class="result"></div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        function showFeature(feature) {
            document.querySelectorAll('.feature-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(feature + '-panel').classList.add('active');
        }

        function hideFeatures() {
            document.querySelectorAll('.feature-panel').forEach(panel => {
                panel.classList.remove('active');
            });
        }

        function showLoading(elementId) {
            const element = document.getElementById(elementId);
            element.style.display = 'block';
            element.innerHTML = '<div class="loading"></div> Processing...';
        }

        function showResult(elementId, content) {
            const element = document.getElementById(elementId);
            element.style.display = 'block';
            
            // Convert code blocks to HTML for better formatting
            if (content.includes('\`\`\`')) {
                const htmlContent = content
                    .replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>')
                    .replace(/\\n/g, '<br>');
                element.innerHTML = htmlContent;
            } else {
                // Preserve line breaks for regular text
                element.innerHTML = content.replace(/\\n/g, '<br>');
            }
        }

        function sendChat() {
            const message = document.getElementById('chat-input').value;
            if (!message.trim()) return;
            
            showLoading('chat-result');
            vscode.postMessage({
                type: 'chat',
                endpoint: '/api/v1/chat',
                data: { message, max_tokens: 500 }
            });
        }

        function generateCode() {
            const prompt = document.getElementById('generate-prompt').value;
            const language = document.getElementById('generate-language').value;
            if (!prompt.trim()) return;
            
            showLoading('generate-result');
            vscode.postMessage({
                type: 'generate',
                endpoint: '/api/v1/generate',
                data: { prompt, language }
            });
        }

        function analyzeCode() {
            const code = document.getElementById('analyze-code').value;
            const language = document.getElementById('analyze-language').value;
            const generateTests = document.getElementById('generate-tests').checked;
            if (!code.trim()) return;
            
            showLoading('analyze-result');
            vscode.postMessage({
                type: 'analyze',
                endpoint: '/api/v1/analyze',
                data: { code, language, generate_tests: generateTests }
            });
        }

        function auditContract() {
            const code = document.getElementById('audit-code').value;
            if (!code.trim()) return;
            
            showLoading('audit-result');
            vscode.postMessage({
                type: 'audit',
                endpoint: '/api/v1/audit',
                data: { code }
            });
        }

        function compileContract() {
            const code = document.getElementById('compile-code').value;
            const contractName = document.getElementById('contract-name').value;
            const optimize = document.getElementById('optimize').checked;
            const optimizerRuns = document.getElementById('optimizer-runs').value;
            if (!code.trim() || !contractName.trim()) return;
            
            showLoading('compile-result');
            vscode.postMessage({
                type: 'compile',
                endpoint: '/api/v1/compile',
                data: { code, contract_name: contractName, optimize, optimizer_runs: parseInt(optimizerRuns) }
            });
        }

        function queryDocs() {
            const query = document.getElementById('docs-query').value;
            const context = document.getElementById('docs-context').value;
            if (!query.trim()) return;
            
            showLoading('docs-result');
            vscode.postMessage({
                type: 'docs',
                endpoint: '/api/v1/docs',
                data: { query, context, max_results: 5 }
            });
        }

        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === 'response') {
                const resultId = message.type + '-result';
                const formattedResponse = formatResponse(message.type, message.data);
                showResult(resultId, formattedResponse);
            } else if (message.command === 'error') {
                const resultId = message.type + '-result';
                showResult(resultId, 'Error: ' + message.error);
            }
        });

        function formatResponse(type, data) {
            console.log('formatResponse called with type:', type, 'data:', data);
            try {
                switch(type) {
                    case 'chat':
                        if (data.response) {
                            console.log('Found data.response:', data.response);
                            return data.response;
                        }
                        console.log('No data.response found, falling back to JSON');
                        return data.code || JSON.stringify(data, null, 2);
                    case 'generate':
                        return data.code || data.generated_code || JSON.stringify(data, null, 2);
                    case 'analyze':
                        if (data.analysis) {
                            return data.analysis + (data.tests ? '\\n\\nGenerated Tests:\\n' + data.tests : '');
                        }
                        return data.result || JSON.stringify(data, null, 2);
                    case 'audit':
                        if (data.ai_analysis) {
                            return 'AI Analysis:\\n' + data.ai_analysis + 
                                   (data.static_analysis ? '\\n\\nStatic Analysis:\\n' + JSON.stringify(data.static_analysis, null, 2) : '');
                        }
                        return JSON.stringify(data, null, 2);
                    case 'compile':
                        if (data.success) {
                            return 'Compilation successful!\\n\\nBytecode: ' + (data.bytecode ? data.bytecode.substring(0, 100) + '...' : 'Generated') +
                                   '\\n\\nABI: ' + JSON.stringify(data.abi, null, 2);
                        } else {
                            return 'Compilation failed:\\n' + (data.errors ? data.errors.join('\\n') : 'Unknown error');
                        }
                    case 'docs':
                        if (data.answer) {
                            return data.answer + (data.sources ? '\\n\\nSources:\\n' + data.sources.map(s => '- ' + s.title + ': ' + s.url).join('\\n') : '');
                        }
                        return JSON.stringify(data, null, 2);
                    default:
                        return JSON.stringify(data, null, 2);
                }
            } catch (e) {
                return JSON.stringify(data, null, 2);
            }
        }
    </script>
</body>
</html>`;
}

export function deactivate() {}
