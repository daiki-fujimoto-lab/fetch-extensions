import os
import shutil

# List of Extension IDs to copy
EXTENSION_IDS = [
    "nkbihfbeogaeaoehlefnkodbefgpgknn",  # MetaMask (example)
    "egjidjbpglichdcondbcbdnbeeppgdph",  # Trust
    "ibnejdfjmmkpcnlpebklmnkoeoihofec",  # TronLink
    "bhhhlbepdkbapadjdnnojkbgioiodbic",  # Solflare
    "fhbohimaelbohpjbbldcngcnapndodjp",  # BNB
    "hnfanknocfeofbddgcijnmhnfnkdnaad",  # Coinbase
]

BACKUP_PATH = os.path.join(os.getcwd(), "Extension_Backups")

# Possible browser profile paths
BROWSERS = {
    "chrome": {
        "win32": os.path.join(os.path.expanduser("~"), f"AppData\\Local\\Google\\Chrome\\User Data"),
        "darwin": os.path.expanduser("~/Library/Application Support/Google/Chrome"),
        "linux": os.path.expanduser("~/.config/google-chrome"),
    },
    "edge": {
        "win32": os.path.join(os.path.expanduser("~"), f"AppData\\Local\\Microsoft\\Edge\\User Data"),
        "darwin": os.path.expanduser("~/Library/Application Support/Microsoft Edge"),
        "linux": os.path.expanduser("~/.config/microsoft-edge"),
    },
    "brave": {
        "win32": os.path.join(os.path.expanduser("~"), f"AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data"),
        "darwin": os.path.expanduser("~/Library/Application Support/BraveSoftware/Brave-Browser"),
        "linux": os.path.expanduser("~/.config/BraveSoftware/Brave-Browser"),
    },
    "firefox": {
        "win32": os.path.join(os.path.expanduser("~"), f"AppData\\Roaming\\Mozilla\\Firefox\\Profiles"),
        "darwin": os.path.expanduser("~/Library/Application Support/Firefox/Profiles"),
        "linux": os.path.expanduser("~/.config/mozilla/firefox"),
    },
}

def copy_folder(src, dest):
    if not os.path.exists(src):
        return
    if not os.path.exists(dest):
        os.makedirs(dest, exist_ok=True)
    
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dest, item)
        if os.path.isdir(s):
            copy_folder(s, d)
        else:
            shutil.copy2(s, d)

def backup_extension_data():
    if not os.path.exists(BACKUP_PATH):
        os.makedirs(BACKUP_PATH, exist_ok=True)
    
    platform = os.sys.platform
    
    for browser, paths in BROWSERS.items():
        user_path = paths.get(platform)
        if not user_path or not os.path.exists(user_path):
            continue
        
        for profile in os.listdir(user_path):
            profile_path = os.path.join(user_path, profile)
            if not os.path.isdir(profile_path):
                continue
            
            for extension_id in EXTENSION_IDS:
                ext_path = os.path.join(profile_path, "Local Extension Settings", extension_id)
                if os.path.exists(ext_path):
                    backup_dir = os.path.join(BACKUP_PATH, browser, profile, extension_id)
                    print(f"Backing up {browser} - {profile} - {extension_id}...")
                    copy_folder(ext_path, backup_dir)
    
    print("Backup completed!")

if __name__ == "__main__":
    backup_extension_data()
