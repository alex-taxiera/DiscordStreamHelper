import {
  GuildCommand
} from 'eris-boiler'
import {
  vip as permission
} from 'eris-boiler/permissions'

export default new GuildCommand({
  name: 'announce',
  description: 'Make an announcment.',
  options: {
    permission,
    parameters: [
      '<-E | --everyone> <-L | --link "link"> <announcement text>'
    ]
  },
  run: async (bot, { msg, params }): Promise<string> => {
    const dbo = await bot.dbm.newQuery('guild').get(msg.channel.guild.id)
    const channelId: string = dbo?.get('announceChannel')

    let url = dbo?.get('streamLink')
    let everyone = false
    for (let i = 0; i < params.length; i++) {
      switch (params[i]) {
        case '-E':
        case '--everyone':
          everyone = true
          break
        case '-L':
        case '--link':
          if (params[i + 1] === '-') {
            url = ''
          } else {
            url = params[i + 1]
            params[i + 1] = '-'
          }
          break
      }
    }

    if (url) {
      params.push(url)
    }

    let content = params
      .filter((val) => !val.startsWith('-'))
      .join(' ')
    if (everyone) {
      content = '@everyone ' + content
    }

    const otherChannel = msg.channel.guild.channels.get(channelId)

    if (otherChannel && (otherChannel.type === 0 || otherChannel.type === 5)) {
      await otherChannel.createMessage(content)
      return `Announcement "${content}" made!`
    }

    return content
  }
})
