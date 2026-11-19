# yecoyz_tablet_apptemplate

A starting point for your own **yecoyz_tablet** app, built with React + Vite + TypeScript. It registers an app on the tablet and shows every part of the SDK working: loading data from Lua, messages from the server, notifications, closing the app and typing into text fields.

The full SDK reference is in `yecoyz_tablet/sdk/README.md`.

## Quick start

1. Copy this folder into your resources and rename it (e.g. `my_tablet_app`). Nothing in the code depends on the folder name.
2. Change `Config.app` in `config.lua`: at least a new **`id`** and **`label`**.
3. Add it to `server.cfg` **after** the tablet:
   ```
   ensure yecoyz_tablet
   ensure my_tablet_app
   ```
4. Open the tablet: your app is on the home screen.

The built page (`web/dist`) is included, so it works without building anything.

## Layout

```
config.lua          app id, label, icon, jobs, and your own settings
client/main.lua     registers the app, answers Tablet.post(...) from the page (RegisterNUICallback)
server/main.lua     server side: validates requests and replies with SendAppMessage
web/                the page (React + Vite)
  index.html        loads the tablet SDK (https://cfx-nui-yecoyz_tablet/sdk/tablet.js)
  src/App.tsx       the example app: replace it with your own
  src/tablet.ts     the SDK, or a stand-in when the page runs in a normal browser
  src/tablet-sdk.d.ts  types for the SDK
  dist/             the build the tablet loads (listed in fxmanifest files {})
```

## Building the page

You need [Node.js](https://nodejs.org) 18 or newer.

```
cd web
npm install
npm run dev     # live preview in your browser at http://127.0.0.1:5174
npm run build   # writes web/dist, then restart the resource in game
```

In the browser preview there is no game, so `src/tablet.ts` answers `Tablet.post` with the fake replies in `BROWSER_REPLIES`. Add one for each event you use and you can build the whole UI without starting FiveM.

The page is shown at **1280 x 766** pixels. A thin home bar floats over the bottom 22 pixels, so let your content reach the bottom edge and keep a little padding at the end of scrolling lists.

## How the pieces talk

| From → to | Page (JS) | Client Lua | Server Lua |
|---|---|---|---|
| Page → client | `await tablet.post('getData', {...})` | `RegisterNUICallback('getData', function(data, cb) cb(result) end)` | |
| Client → page | `tablet.on('pinged', fn)` | `exports.yecoyz_tablet:SendAppMessage(appId, 'pinged', data)` | |
| Server → page | `tablet.on('serverReplied', fn)` | | `exports.yecoyz_tablet:SendAppMessage(source, appId, 'serverReplied', data)` |
| Notification | `tablet.notify(title, text)` | `exports.yecoyz_tablet:Notify({ app = appId, title = '...', text = '...' })` | `exports.yecoyz_tablet:Notify(source, { ... })` |

Messages sent while the app's page has not been loaded yet are dropped, so load what the page needs with `tablet.post` in `tablet.ready(...)` and use messages for live updates.

Other useful bits: `tablet.on('visibility', fn)` (app shown / hidden), `tablet.close()`, `exports.yecoyz_tablet:OpenApp(appId)`, and the client events `yecoyz_tablet:client:appOpened` / `appClosed`.

## Security

The page and the client Lua run on the player's computer, so anyone can send your server events any data. On the server:

- check the type and length of everything you receive,
- decide prices, amounts and permissions on the server, never take them from the client,
- rate-limit anything that gives something (see `Config.requestCooldown` in the example).

`Config.app.jobs` only hides the icon; check jobs on the server for anything that matters.

## Using your own icon

Put a square PNG in `web/public/icon.png` (Vite copies it to `web/dist/icon.png`) and set `icon = 'web/dist/icon.png'` in `config.lua`. Or use one of the built-in names listed in the SDK README.
