# HiveMind Copilot - Multi-Device Access Guide

## 🌐 **Accessing Extension from Another Laptop**

### Method 1: Local Installation (Recommended)

#### Step 1: Transfer Files
1. **Copy the extension file** to the other laptop:
   ```
   hivemind-copilot-0.2.0.vsix (618.5 KB)
   ```

2. **Copy the entire project** (optional, for local backend):
   ```
   HIvemindCopilot/ folder
   ```

#### Step 2: Install Extension
1. Open VS Code on the other laptop
2. `Ctrl+Shift+P` → "Extensions: Install from VSIX..."
3. Select `hivemind-copilot-0.2.0.vsix`
4. Restart VS Code

#### Step 3: Choose Backend Option

**Option A: Local Backend (Best Performance)**
```bash
# On the other laptop
cd HIvemindCopilot/hivemind
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

**Option B: Network Backend (Shared)**
- Configure extension to use your main laptop's backend
- See "Network Configuration" section below

---

### Method 2: Network Backend Access

#### Step 1: Find Your Main Laptop's IP Address
```bash
# On your main laptop (macOS)
ifconfig | grep "inet " | grep -v 127.0.0.1

# On Windows
ipconfig | findstr "IPv4"

# On Linux
ip addr show | grep "inet " | grep -v 127.0.0.1
```

Example output: `192.168.1.100`

#### Step 2: Start Backend with Network Access
```bash
# On your main laptop
cd HIvemindCopilot/hivemind
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Step 3: Configure Extension on Other Laptop
1. Install the extension VSIX file
2. Open VS Code Settings (`Ctrl+,`)
3. Search for "hivemind"
4. Change `Hivemind: Api Url` from:
   ```
   http://localhost:8000
   ```
   To:
   ```
   http://192.168.1.100:8000
   ```
   (Replace with your actual IP address)

#### Step 4: Test Connection
1. Open VS Code Developer Console (Help → Toggle Developer Tools)
2. Try using the Chat feature
3. Check for connection errors in Console tab

---

### Method 3: Cloud Deployment (Advanced)

#### Deploy Backend to Cloud Service:
- **Heroku**: Free tier available
- **Railway**: Easy deployment
- **DigitalOcean**: $5/month droplet
- **AWS/GCP**: Various options

#### Update Extension Configuration:
```
Hivemind: Api Url = https://your-app.herokuapp.com
```

---

## 🔧 **Troubleshooting Network Access**

### Firewall Issues
```bash
# macOS - Allow port 8000
sudo pfctl -f /etc/pf.conf

# Windows - Add firewall rule
netsh advfirewall firewall add rule name="HiveMind Backend" dir=in action=allow protocol=TCP localport=8000

# Linux - UFW
sudo ufw allow 8000
```

### Connection Testing
```bash
# Test from other laptop
curl http://192.168.1.100:8000/health

# Expected response:
{"status":"healthy","version":"0.1.0"}
```

### Common Issues
1. **Connection Refused**: Check firewall settings
2. **Timeout**: Verify IP address and port
3. **CORS Errors**: Backend already configured for cross-origin requests
4. **Extension Not Loading**: Ensure VSIX version is 0.2.0

---

## 📋 **Quick Setup Checklist**

### For the Other Laptop:
- [ ] Install `hivemind-copilot-0.2.0.vsix`
- [ ] Restart VS Code
- [ ] Configure API URL (if using network backend)
- [ ] Test connection with Chat feature

### For Network Access:
- [ ] Find main laptop IP address
- [ ] Start backend with `--host 0.0.0.0`
- [ ] Configure firewall if needed
- [ ] Update extension settings on other laptop
- [ ] Test with `curl` command

---

## 🔒 **Security Notes**

- Network backend exposes API to local network
- Use VPN for secure remote access
- Consider authentication for production use
- Firewall rules should be specific to your network

---

## 📞 **Support**

If you encounter issues:
1. Check VS Code Developer Console for errors
2. Verify backend is running: `curl http://IP:8000/health`
3. Ensure both devices are on same network
4. Check firewall settings on both devices
