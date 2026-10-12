# Website

A dedicated desktop window for your website.

Edit `src/main/website.ts` to choose the home URL and any sign-in origins. The Navigate menu provides Home, Back, Forward, and Reload. External links open in your default browser. Connection errors can be retried with Reload. Remote pages have no privileged IPC access; keep `trustedOrigins` empty unless your application explicitly requires it.

## Development

Use Node.js 24.14.1 or later.

```sh
npm ci
npm run dev
```

```sh
npm run gen
npm run typecheck
npm run test:e2e
npm run build
npm run pack
```

Build and package on the target operating system. The configuration includes macOS, Windows, and Linux. Local packaging is unsigned; configure signing in `mobrowser.conf.json` when distributing the app.

## Application settings

Set the app name, bundle identifiers, version, and platform packaging options in `mobrowser.conf.json`. Icons are in `assets/`; bundled resources are in `resources/`.

Built with MōBrowser 2.18.0. See the [getting-started guide](https://teamdev.com/mobrowser/docs/quickstart/) and [MōBrowser documentation](https://teamdev.com/mobrowser/docs/) for development and packaging.
