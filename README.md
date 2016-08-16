#about

this app uses meteor, node-irc, and d3 to display realtime metrics about emoticon and copypasta usage in a particular twitch chat.
most of the interesting work happens in imports/api/chats.js and imports/ui/body.js. instead of querying twitch's api to get emoticons, the entire endpoint is saved as one file and the relevant info inserted into a mongo collection. searching through this collection as it is too intensive, so chat-data indexes emoticons by popularity and only initially checks the whole collection if need be.


