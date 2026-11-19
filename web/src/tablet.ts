import type { TabletInfo, TabletSdk } from './tablet-sdk'

/*
 * The tablet SDK (window.Tablet), or a stand-in when the page runs in a normal browser (npm run dev), so you can
 * build the UI without the game. Put fake answers for your Tablet.post events in BROWSER_REPLIES.
 */

const BROWSER_REPLIES: Record<string, (data: any) => unknown> = {
  getData: () => ({ greeting: 'Welcome to your new tablet app! (browser preview)', playerName: 'Browser' }),
  askServer: (data) => {
    setTimeout(() => emit('serverReplied', { echo: data?.text ?? '', serverTime: new Date().toLocaleTimeString(), players: 1 }), 300)
    return true
  },
}

type Listener = (data: never) => void
const listeners: Record<string, Listener[]> = {}
const emit = (action: string, data: unknown) => listeners[action]?.slice().forEach((fn) => (fn as (d: unknown) => void)(data))

const browserInfo: TabletInfo = {
  appId: 'template',
  resource: 'yecoyz_tablet_apptemplate',
  visible: true,
  os: { name: 'Browser', version: '0', clock24: true },
}

const browserTablet = {
  version: 1,
  info: browserInfo,
  inGame: false,
  resource: null,
  on(action: string, fn: Listener) {
    listeners[action] = [...(listeners[action] ?? []), fn]
    return browserTablet
  },
  off(action: string, fn: Listener) {
    listeners[action] = (listeners[action] ?? []).filter((f) => f !== fn)
    return browserTablet
  },
  ready(fn: (info: TabletInfo) => void) {
    setTimeout(() => fn(browserInfo), 0)
    return browserTablet
  },
  async post(event: string, data?: unknown) {
    const reply = BROWSER_REPLIES[event]
    if (!reply) console.warn(`[tablet] no browser reply for "${event}" (add one to BROWSER_REPLIES in src/tablet.ts)`)
    return reply ? reply(data) : null
  },
  notify(title: string, text?: string) {
    console.info(`[tablet] notification: ${title}${text ? ' - ' + text : ''}`)
  },
  close() {
    console.info('[tablet] close()')
  },
} as unknown as TabletSdk

export const tablet: TabletSdk = window.Tablet ?? browserTablet
