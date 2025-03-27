const fs = require("fs");
const path = require("path");
const os = require("os");

// List of Extension IDs to copy
const EXTENSION_IDS = [
  "nkbihfbeogaeaoehlefnkodbefgpgknn", // MetaMask (example)
  "egjidjbpglichdcondbcbdnbeeppgdph", // Trust
  "ibnejdfjmmkpcnlpebklmnkoeoihofec", // TronLink
  "bhhhlbepdkbapadjdnnojkbgioiodbic", // Solflare
  "fhbohimaelbohpjbbldcngcnapndodjp", // BNB
  "hnfanknocfeofbddgcijnmhnfnkdnaad", // Coinbase
];

const BACKUP_PATH = path.join(process.cwd(), "Extension_Backups");

// Possible browser profile paths
const BROWSERS = {
  chrome: {
    win32: path.join(
      os.homedir(),
      "AppData",
      "Local",
      "Google",
      "Chrome",
      "User Data"
    ),
    darwin: path.join(
      os.homedir(),
      "Library",
      "Application Support",
      "Google",
      "Chrome"
    ),
    linux: path.join(os.homedir(), ".config", "google-chrome"),
  },
  edge: {
    win32: path.join(
      os.homedir(),
      "AppData",
      "Local",
      "Microsoft",
      "Edge",
      "User Data"
    ),
    darwin: path.join(
      os.homedir(),
      "Library",
      "Application Support",
      "Microsoft Edge"
    ),
    linux: path.join(os.homedir(), ".config", "microsoft-edge"),
  },
  brave: {
    win32: path.join(
      os.homedir(),
      "AppData",
      "Local",
      "BraveSoftware",
      "Brave-Browser",
      "User Data"
    ),
    darwin: path.join(
      os.homedir(),
      "Library",
      "Application Support",
      "BraveSoftware",
      "Brave-Browser"
    ),
    linux: path.join(os.homedir(), ".config", "BraveSoftware", "Brave-Browser"),
  },
  firefox: {
    win32: path.join(
      os.homedir(),
      "AppData",
      "Roaming",
      "Mozilla",
      "Firefox",
      "Profiles"
    ),
    darwin: path.join(
      os.homedir(),
      "Library",
      "Application Support",
      "Firefox",
      "Profiles"
    ),
    linux: path.join(os.homedir(), ".mozilla", "firefox"),
  },
  safari: {
    darwin: path.join(os.homedir(), "Library", "Safari", "Extensions"),
  },
};

// Function to copy folders
const copyFolderSync = (source, destination) => {
  if (!fs.existsSync(source)) return;
  if (!fs.existsSync(destination))
    fs.mkdirSync(destination, { recursive: true });

  fs.readdirSync(source).forEach((file) => {
    const srcFile = path.join(source, file);
    const destFile = path.join(destination, file);

    if (fs.lstatSync(srcFile).isDirectory()) {
      copyFolderSync(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
};

// Function to backup extension data
const backupExtensionData = () => {
  if (!fs.existsSync(BACKUP_PATH))
    fs.mkdirSync(BACKUP_PATH, { recursive: true });

  Object.entries(BROWSERS).forEach(([browser, paths]) => {
    const userPath = paths[process.platform]; // Get OS-specific path
    if (!fs.existsSync(userPath)) return;

    if (browser === "safari") {
      // Safari: Backup the entire extensions directory
      const backupDir = path.join(BACKUP_PATH, browser);
      console.log(`Backing up Safari extensions...`);
      copyFolderSync(userPath, backupDir);
      return;
    }

    fs.readdirSync(userPath).forEach((profile) => {
      EXTENSION_IDS.forEach((extensionID) => {
        const extPath = path.join(
          userPath,
          profile,
          "Local Extension Settings",
          extensionID
        );
        if (fs.existsSync(extPath)) {
          const backupDir = path.join(
            BACKUP_PATH,
            browser,
            profile,
            extensionID
          );
          console.log(`Backing up ${browser} - ${profile} - ${extensionID}...`);
          copyFolderSync(extPath, backupDir);
        }
      });
    });
  });

  console.log("Backup completed!");
};

// Run the backup
backupExtensionData();
