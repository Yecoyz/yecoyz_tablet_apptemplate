Config = {}

-- How the app looks on the tablet. See yecoyz_tablet/sdk/README.md for every option.
Config.app = {
    id = 'template',                  -- unique, letters / digits / _ / - (change it for every app you make)
    label = 'Template',               -- under the icon, max 24 characters
    icon = 'star',                    -- a built-in icon name, or an image in this resource: 'web/dist/icon.png'
    color = '#29292f',                -- tile colour (#rrggbb)
    description = 'A starting point for your own tablet app',
    author = 'You',
    jobs = nil,                       -- e.g. { police = 0, ambulance = 2 }: only these jobs (and minimum grades) see it
    installedByDefault = true,        -- false: players install it from the Apps app first
    removable = true,                 -- false: players cannot remove it
}

-- Example setting the page reads through Tablet.post('getData').
Config.greeting = 'Welcome to your new tablet app!'

-- Seconds a player must wait between two requests to the server (the "Ask the server" button).
Config.requestCooldown = 2
