const { promises: fs } = require('fs');
const path = require('path');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  let entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? await copyDir(srcPath, destPath)
      : await fs.copyFile(srcPath, destPath);
  }
}

async function makeExtensionDirectory(browserName) {
  // contentscript is handled by webpack

  // this directory structure is expected
  await copyDir('./src/images', `dist/${browserName}/images`);
  await copyDir('./src/static', `dist/${browserName}`);
  await fs.copyFile(
    path.join(__dirname, `./src/browser/${browserName}/serviceWorker.js`),
    path.join(__dirname, `./dist/${browserName}/serviceWorker.js`)
  );
  await fs.copyFile(
    path.join(__dirname, `./src/browser/${browserName}/popup.js`),
    path.join(__dirname, `./dist/${browserName}/popup.js`)
  );
  await fs.copyFile(
    path.join(__dirname, `./src/browser/${browserName}/manifest.json`),
    path.join(__dirname, `./dist/${browserName}/manifest.json`)
  );
}

/**
 * this script expects an argument to know which browser to copy to
 * eg: `node makeDist.js chrome`
 */
const browser = process.argv[2]
if (!browser) {
  console.error(`makeDist: browser: ${browser}`)
  process.exit();
}

makeExtensionDirectory(browser);
