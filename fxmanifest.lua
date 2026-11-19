fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Yecoyz'
description 'Template for building your own yecoyz_tablet app (React + Vite)'
version '1.0.0'

-- The tablet must start first: it is the one that shows the app.
dependency 'yecoyz_tablet'

shared_script 'config.lua'
client_script 'client/main.lua'
server_script 'server/main.lua'

-- The app page. It is not the ui_page (the tablet shows it), but it must be listed here to be loadable.
files {
    'web/dist/**/*',
}
