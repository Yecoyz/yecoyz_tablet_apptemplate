-- Server side of the app. Never trust what the page sends: it runs on the player's machine.
local RES = GetCurrentResourceName()
local APP_ID = Config.app.id
local MAX_TEXT = 60

local lastRequest = {} -- source -> GetGameTimer() of the last accepted request

RegisterNetEvent(RES .. ':server:asked', function(text)
    local src = source

    -- Validate everything that comes from the client: type, length, rate.
    if type(text) ~= 'string' then return end
    text = text:gsub('%c', ''):sub(1, MAX_TEXT)

    local now = GetGameTimer()
    if lastRequest[src] and now - lastRequest[src] < Config.requestCooldown * 1000 then
        exports.yecoyz_tablet:Notify(src, { app = APP_ID, title = Config.app.label, text = 'Slow down a little.' })
        return
    end
    lastRequest[src] = now

    -- Server -> page: received there with Tablet.on('serverReplied', fn).
    exports.yecoyz_tablet:SendAppMessage(src, APP_ID, 'serverReplied', {
        echo = text,
        serverTime = os.date('%H:%M:%S'),
        players = #GetPlayers(),
    })
end)

AddEventHandler('playerDropped', function()
    lastRequest[source] = nil
end)
