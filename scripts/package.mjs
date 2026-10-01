// Builds DOIT.app for this Mac's CPU (Apple Silicon or Intel). Pass --install to copy it to /Applications.
import { execSync } from 'node:child_process';
import { cpSync, rmSync } from 'node:fs';

if (process.platform !== 'darwin') {
  console.error('DOIT is packaged for macOS only. Use `npm start` to run it elsewhere.');
  process.exit(1);
}
const arch = process.arch === 'arm64' ? 'arm64' : 'x64';
const app = `release/DOIT-darwin-${arch}/DOIT.app`;
const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

run('npx vite build');
run(
  `npx electron-packager . DOIT --platform=darwin --arch=${arch} --out=release --overwrite --icon=build/icon.icns ` +
    `--ignore='^/(src|release|build|scripts|index.html|vite.config.js|node_modules)($|/)'`,
);
// Ignore ELECTRON_RUN_AS_NODE so the app can't be started as a plain Node process.
run(`npx @electron/fuses write --app ${app} RunAsNode=off`);
// Ad-hoc signature so macOS will run the locally built app.
run(`codesign --force --deep -s - ${app}`);

if (process.argv.includes('--install')) {
  rmSync('/Applications/DOIT.app', { recursive: true, force: true });
  cpSync(app, '/Applications/DOIT.app', { recursive: true, verbatimSymlinks: true });
  console.log('\nInstalled to /Applications/DOIT.app');
} else {
  console.log(`\nBuilt ${app}`);
}
