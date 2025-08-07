#!/usr/bin/env python3
"""
HiveMind Copilot Cloud Deployment Script

This script helps deploy the HiveMind Copilot backend to various cloud platforms.
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def run_command(cmd, cwd=None):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error running command: {cmd}")
            print(f"Error: {result.stderr}")
            return False
        return result.stdout.strip()
    except Exception as e:
        print(f"Exception running command: {cmd}")
        print(f"Error: {e}")
        return False

def check_requirements():
    """Check if required tools are installed"""
    print("🔍 Checking requirements...")
    
    # Check if git is installed
    if not run_command("git --version"):
        print("❌ Git is not installed. Please install Git first.")
        return False
    
    print("✅ Git is installed")
    return True

def deploy_to_railway():
    """Deploy to Railway"""
    print("\n🚂 Deploying to Railway...")
    
    # Check if Railway CLI is installed
    if not run_command("railway --version"):
        print("❌ Railway CLI not found. Installing...")
        if not run_command("npm install -g @railway/cli"):
            print("❌ Failed to install Railway CLI")
            return False
    
    print("✅ Railway CLI is ready")
    
    # Login to Railway
    print("🔐 Please login to Railway...")
    if not run_command("railway login"):
        print("❌ Failed to login to Railway")
        return False
    
    # Create new project
    print("📦 Creating Railway project...")
    project_name = "hivemind-copilot-backend"
    
    # Change to backend directory
    backend_dir = Path(__file__).parent / "hivemind"
    
    # Initialize Railway project
    if not run_command(f"railway project new {project_name}", cwd=backend_dir):
        print("❌ Failed to create Railway project")
        return False
    
    # Set environment variables
    print("🔧 Setting environment variables...")
    env_vars = {
        "GROQ_API_KEY": os.getenv("GROQ_API_KEY", "your-groq-api-key-here"),
        "CODEX_MODEL": "llama3-70b-8192",
        "DEBUG_MODEL": "llama3-8b-8192",
        "HEDERA_NETWORK": "testnet",
        "HEDERA_ACCOUNT_ID": os.getenv("HEDERA_ACCOUNT_ID", "your-hedera-account-id"),
        "HEDERA_PRIVATE_KEY": os.getenv("HEDERA_PRIVATE_KEY", "your-hedera-private-key"),
        "HEDERA_MIRROR_NODE_URL": "https://testnet.mirrornode.hedera.com/api/v1/",
        "HEDERA_CONTRACT_REGISTRY_ID": "0.0.6359980",
        "HEDERA_TESTNET_RPC_URL": "https://testnet.hashio.io/api",
        "CONTRACT_REGISTRY": "0.0.6273049",
        "TESTNET_RPC": "https://testnet.hashio.io/api",
        "HOST": "0.0.0.0"
    }
    
    for key, value in env_vars.items():
        if not run_command(f'railway variables set {key}="{value}"', cwd=backend_dir):
            print(f"⚠️ Warning: Failed to set {key}")
    
    # Deploy
    print("🚀 Deploying to Railway...")
    if not run_command("railway up", cwd=backend_dir):
        print("❌ Failed to deploy to Railway")
        return False
    
    # Get the deployment URL
    print("🌐 Getting deployment URL...")
    url = run_command("railway domain", cwd=backend_dir)
    if url:
        print(f"✅ Backend deployed successfully!")
        print(f"🔗 URL: https://{url}")
        return f"https://{url}"
    
    return True

def deploy_to_render():
    """Deploy to Render"""
    print("\n🎨 Deploying to Render...")
    print("📋 To deploy to Render:")
    print("1. Go to https://render.com")
    print("2. Connect your GitHub repository")
    print("3. Create a new Web Service")
    print("4. Use the render.yaml configuration file")
    print("5. Set environment variables in Render dashboard")
    
    return "render-deployment-manual"

def update_extension_config(backend_url):
    """Update the VS Code extension to use the cloud backend"""
    print(f"\n🔧 Updating extension configuration for: {backend_url}")
    
    # Update package.json with new default API URL
    package_json_path = Path(__file__).parent / "hivemind-frontend" / "package.json"
    
    if package_json_path.exists():
        with open(package_json_path, 'r') as f:
            package_data = json.load(f)
        
        # Update the default API URL
        if 'contributes' in package_data and 'configuration' in package_data['contributes']:
            properties = package_data['contributes']['configuration']['properties']
            if 'hivemind.apiUrl' in properties:
                properties['hivemind.apiUrl']['default'] = backend_url
                print(f"✅ Updated default API URL to: {backend_url}")
        
        # Update version for new release
        current_version = package_data.get('version', '0.2.0')
        version_parts = current_version.split('.')
        version_parts[-1] = str(int(version_parts[-1]) + 1)
        new_version = '.'.join(version_parts)
        package_data['version'] = new_version
        
        with open(package_json_path, 'w') as f:
            json.dump(package_data, f, indent=2)
        
        print(f"✅ Updated extension version to: {new_version}")
        return new_version
    
    return None

def build_extension(version):
    """Build the updated extension"""
    print(f"\n📦 Building extension v{version}...")
    
    frontend_dir = Path(__file__).parent / "hivemind-frontend"
    
    # Compile TypeScript
    if not run_command("npm run compile", cwd=frontend_dir):
        print("❌ Failed to compile TypeScript")
        return False
    
    # Package extension
    if not run_command("npx vsce package", cwd=frontend_dir):
        print("❌ Failed to package extension")
        return False
    
    print(f"✅ Extension built successfully: hivemind-copilot-{version}.vsix")
    return True

def main():
    """Main deployment function"""
    print("🚀 HiveMind Copilot Cloud Deployment")
    print("=" * 50)
    
    if not check_requirements():
        sys.exit(1)
    
    print("\nChoose deployment platform:")
    print("1. Railway (Free tier, automatic)")
    print("2. Render (Free tier, manual setup)")
    print("3. Both")
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    backend_url = None
    
    if choice in ['1', '3']:
        backend_url = deploy_to_railway()
        if not backend_url or backend_url is True:
            print("❌ Railway deployment failed or incomplete")
            return
    
    if choice in ['2', '3']:
        deploy_to_render()
    
    if backend_url and backend_url.startswith('https://'):
        # Update extension configuration
        new_version = update_extension_config(backend_url)
        
        if new_version:
            # Build new extension
            if build_extension(new_version):
                print(f"\n🎉 Deployment Complete!")
                print(f"📡 Backend URL: {backend_url}")
                print(f"📦 Extension: hivemind-copilot-{new_version}.vsix")
                print(f"\n📋 Next Steps:")
                print(f"1. Test backend: curl {backend_url}/health")
                print(f"2. Install updated extension VSIX file")
                print(f"3. Extension will automatically use cloud backend")
    
    print("\n✅ Deployment process completed!")

if __name__ == "__main__":
    main()
