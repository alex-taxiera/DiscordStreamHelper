const Command = require('./Command.js')

module.exports = new Command({
  name: 'announce',
  description: 'Make an announcment',
  parameters: ['<-e/-everyone> (mention everyone? default no) <-l link> (default in config) <channel mention> (#ChannelName default in config) <announcement text>'],
  permission: 'VIP',
  run: async function ({ channel, params, channelId, url, guild }) {
    let everyone = false
    channelId = channel || channelId

    for (let i = 0; i < params.length; i++) {
      switch (params[i]) {
        case '-e':
        case '-everyone':
          everyone = true
          break
        case '-l':
          if (params[i + 1] === '-') {
            url = ''
          } else {
            url = params[i + 1]
            params[i + 1] = '-'
          }
          break
      }
    }
    params.push(url)
    let content = params.filter((val) => !val.startsWith('-') && !val.startsWith('<') && val !== '-').join(' ')
    if (everyone) content = '@everyone ' + content
    return guild.channels.get(channelId).createMessage({ content, disableEveryone: false })
    .then((m) => { return { content: `Announcement "${m.content}" made!`, delay: 20000 } })
    .catch((e) => { console.log(e); return { content: 'error' } })
  }
})
