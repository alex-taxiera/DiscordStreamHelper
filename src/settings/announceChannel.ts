import {
  SettingCommand
} from 'eris-boiler'

export default new SettingCommand({
  name: 'announceChannel',
  description: 'Set the Announcement Channel',
  displayName: 'Announcement Channel',
  setting: 'announceChannel',
  options: {
    parameters: [ 'channel mention/id' ]
  },
  getValue: async function (bot, { msg }): Promise<string> {
    const dbo = await bot.dbm.newQuery('guild').get(msg.channel.guild.id)
    const channelId = dbo?.get(this.setting)

    if (!channelId) {
      return 'None'
    }

    return `<#${channelId}>`
  },
  run: async function (bot, { msg: { channel }, params }): Promise<string> {
    const channelId = params[0]
    if (!channel.guild.channels.get(channelId)) {
      return 'Cannot find that channel!'
    }
    const dbGuild = await bot.dbm.newQuery('guild').get(channel.guild.id)
    if (!dbGuild) {
      throw Error('fuck')
    }
    await dbGuild.save({
      [this.setting]: channelId
    })

    return 'Channel set'
  }
})
