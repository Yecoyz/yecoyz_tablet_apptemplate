-- Registers the app on the tablet and answers the page's Tablet.post(...) calls.
local RES = GetCurrentResourceName()
local APP_ID = Config.app.id

local function registerApp()
    local app = Config.app
    local ok, err = exports.yecoyz_tablet:RegisterApp({
        id = app.id,
        label = app.label,
        ui = 'web/dist/index.html', -- the built page (npm run build in web/)
        icon = app.icon,
        color = app.color,
        description = app.description,
        author = app.author,
        jobs = app.jobs,
        installedByDefault = app.installedByDefault,
        removable = app.removable,
    })
    if not ok then print(('[%s] could not register the app: %s'):format(RES, err)) end
end

CreateThread(registerApp)

-- The tablet forgets its apps when it restarts, so register again when it comes back.
AddEventHandler('onClientResourceStart', function(resource)
    if resource == 'yecoyz_tablet' then registerApp() end
end)

-- Page -> Lua: Tablet.post('getData') lands here. Whatever goes into cb() is what the Promise resolves with.
RegisterNUICallback('getData', function(_, cb)
    cb({
        greeting = Config.greeting,
        playerName = GetPlayerName(PlayerId()),
    })
end)

-- Page -> Lua -> server: the server answers with exports.yecoyz_tablet:SendAppMessage (see server/main.lua),
-- which the page receives with Tablet.on('serverReplied', fn).
RegisterNUICallback('askServer', function(data, cb)
    local text = type(data) == 'table' and data.text or nil
    TriggerServerEvent(RES .. ':server:asked', type(text) == 'string' and text or '')
    cb(true)
end)

-- Lua -> page: /templateping sends the page a message and puts a notification on the tablet.
RegisterCommand('templateping', function()
    exports.yecoyz_tablet:SendAppMessage(APP_ID, 'pinged', { at = ('%02d:%02d'):format(GetClockHours(), GetClockMinutes()) })
    exports.yecoyz_tablet:Notify({ app = APP_ID, title = Config.app.label, text = 'Lua sent the app a message.' })
end, false)

-- The tablet tells every resource when an app is opened or closed.
AddEventHandler('yecoyz_tablet:client:appOpened', function(id)
    if id ~= APP_ID then return end
    -- e.g. start something only needed while the app is on screen
end)

AddEventHandler('yecoyz_tablet:client:appClosed', function(id)
    if id ~= APP_ID then return end
    -- ...and stop it again here
end)
