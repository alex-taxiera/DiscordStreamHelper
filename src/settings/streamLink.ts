import {
  SettingCommand
} from 'eris-boiler'

export default new SettingCommand({
  name: 'streamLink',
  description: 'Set the Stream Link',
  displayName: 'Stream Link',
  setting: 'streamLink',
  options: {
    parameters: [ 'url' ]
  },
  getValue: async function (bot, { msg }): Promise<string> {
    const dbo = await bot.dbm.newQuery('guild').get(msg.channel.guild.id)
    const url = dbo?.get(this.setting)

    if (!url) {
      return 'None'
    }

    return `<${url}>`
  },
  run: async function (bot, { msg: { channel }, params }): Promise<string> {
    const url = params[0]

    const dbGuild = await bot.dbm.newQuery('guild').get(channel.guild.id)
    if (!dbGuild) {
      throw Error('fuck')
    }
    await dbGuild.save({
      [this.setting]: url
    })

    return 'Link set'
  }
})
