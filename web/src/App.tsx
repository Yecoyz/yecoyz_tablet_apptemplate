import { useEffect, useState, type FormEvent } from 'react'
import { tablet } from './tablet'

type Data = { greeting: string; playerName: string }
type ServerReply = { echo: string; serverTime: string; players: number }

export function App() {
  const [data, setData] = useState<Data | null>(null)
  const [visible, setVisible] = useState(true)
  const [text, setText] = useState('')
  const [log, setLog] = useState<string[]>([])

  const addLog = (line: string) => setLog((lines) => [line, ...lines].slice(0, 50))

  useEffect(() => {
    // Load what the page needs once the tablet has connected (client/main.lua: RegisterNUICallback('getData')).
    tablet.ready(async (info) => {
      addLog(`Ready: app "${info.appId}" from ${info.resource}`)
      setData(await tablet.post<Data>('getData'))
    })

    // Live updates from Lua: exports.yecoyz_tablet:SendAppMessage(appId, action, data)
    const onServerReplied = (reply: ServerReply) =>
      addLog(`Server says: "${reply.echo}" at ${reply.serverTime} (${reply.players} online)`)
    const onPinged = (msg: { at: string }) => addLog(`Pinged from Lua at ${msg.at}`)
    const onVisibility = (shown: boolean) => setVisible(shown)

    tablet.on('serverReplied', onServerReplied).on('pinged', onPinged).on('visibility', onVisibility)
    return () => {
      tablet.off('serverReplied', onServerReplied).off('pinged', onPinged).off('visibility', onVisibility)
    }
  }, [])

  const askServer = (e: FormEvent) => {
    e.preventDefault()
    tablet.post('askServer', { text })
    setText('')
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <h1>Template app</h1>
          <p className="muted">{data ? `${data.greeting} Hi, ${data.playerName}.` : 'Connecting to the tablet...'}</p>
        </div>
        <span className={`pill ${visible ? 'on' : ''}`}>{tablet.inGame ? (visible ? 'Shown' : 'Hidden') : 'Browser'}</span>
      </header>

      <section className="content">
        <div className="card">
          <h2>Ask the server</h2>
          <p className="muted">Page &rarr; client Lua &rarr; server &rarr; back to the page with SendAppMessage.</p>
          <form className="row" onSubmit={askServer}>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Say something" maxLength={60} />
            <button type="submit">Send</button>
          </form>
        </div>

        <div className="card">
          <h2>Tablet</h2>
          <p className="muted">
            Run <code>/templateping</code> in chat to send a message from Lua.
          </p>
          <div className="row">
            <button className="ghost" onClick={() => tablet.notify('Template', 'A notification from the app page')}>
              Notify
            </button>
            <button className="ghost" onClick={() => tablet.close()}>
              Close app
            </button>
          </div>
        </div>

        <div className="card wide">
          <h2>Log</h2>
          <pre className="log">{log.join('\n') || 'Nothing yet.'}</pre>
        </div>
      </section>
    </main>
  )
}
