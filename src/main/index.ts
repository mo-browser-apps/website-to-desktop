import { app, BrowserWindow, Menu, MenuItem, workspace } from '@mobrowser/api';
import { website } from './website';

const home = new URL(website.url);
if (home.protocol !== 'https:') throw new Error('The website URL must use HTTPS.');
const allowedOrigins = new Set([home.origin, ...website.allowedOrigins]);
const win = new BrowserWindow();
win.setTitle(app.name);
win.setSize({ width: 1100, height: 800 });
win.centerWindow();

function configureNavigation(window: BrowserWindow) {
  // Allow browsing without granting remote pages access to privileged IPC.
  window.browser.handle('navigation', ({ url, origin, hasUserGesture }) => {
    if (allowedOrigins.has(origin)) return 'proceed';
    if (hasUserGesture && ['https:', 'http:', 'mailto:'].includes(new URL(url).protocol)) {
      workspace.openUrl(url);
    }
    return 'cancel';
  });
  window.browser.handle('openPopup', ({ url, popup }) => {
    if (URL.canParse(url) && allowedOrigins.has(new URL(url).origin)) {
      configureNavigation(popup);
      return 'open';
    }
    if (URL.canParse(url) && ['https:', 'http:'].includes(new URL(url).protocol)) workspace.openUrl(url);
    return 'block';
  });
}
configureNavigation(win);
const menu = new Menu({ items: [
  new Menu({ label: app.name, items: ['quit'] }),
  new Menu({ label: 'Edit', items: ['undo', 'redo', 'separator', 'cut', 'copy', 'paste', 'selectAll'] }),
  new Menu({ label: 'Navigate', items: [
    new MenuItem({ id: 'item-1', label: 'Home', shortcut: 'CommandOrControl+Shift+H', action: () => win.browser.loadUrl(home.href) }),
    new MenuItem({ id: 'item-2', label: 'Back', shortcut: 'Alt+Left', action: () => win.browser.goBack() }),
    new MenuItem({ id: 'item-3', label: 'Forward', shortcut: 'Alt+Right', action: () => win.browser.goForward() }),
    new MenuItem({ id: 'item-4', label: 'Reload', shortcut: 'CommandOrControl+R', action: () => win.browser.reload() }),
    'separator',
    new MenuItem({ id: 'item-5', label: 'Open website in browser', action: () => workspace.openUrl(home.href) }),
  ] }),
] });
if (process.platform === 'darwin') app.setMenu(menu); else win.setMenu(menu);
app.on('activated', () => win.show());
win.browser.loadUrl(home.href);
win.show();
