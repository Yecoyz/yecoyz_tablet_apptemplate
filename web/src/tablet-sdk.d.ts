// Types for sdk/tablet.js. Copy next to your app's source and reference it, or add it to tsconfig "include".

export interface TabletInfo {
  appId: string
  resource: string
  visible: boolean
  os: { name: string; version: string; clock24: boolean }
}

export interface TabletSdk {
  readonly version: number
  readonly info: TabletInfo | null
  /** false in a normal browser (npm run dev) */
  readonly inGame: boolean
  /** this page's resource name (from https://cfx-nui-<resource>/...), null in a browser */
  readonly resource: string | null
  /** Messages from Lua: exports.yecoyz_tablet:SendAppMessage(id, action, data). Also 'ready' and 'visibility'. */
  on<T = unknown>(action: string, fn: (data: T) => void): TabletSdk
  on(action: 'ready', fn: (info: TabletInfo) => void): TabletSdk
  on(action: 'visibility', fn: (visible: boolean) => void): TabletSdk
  off(action: string, fn: (data: never) => void): TabletSdk
  ready(fn: (info: TabletInfo) => void): TabletSdk
  /** POST to RegisterNUICallback(event) in the app's own resource. */
  post<T = unknown>(event: string, data?: unknown): Promise<T>
  notify(title: string, text?: string): void
  /** back to the home screen */
  close(): void
}

declare global {
  interface Window {
    Tablet: TabletSdk
  }
  const Tablet: TabletSdk
}
