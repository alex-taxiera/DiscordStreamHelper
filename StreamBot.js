const Eris = require('eris')
// const rng = require('seedrandom')()
const colors = require('colors')
const moment = require('moment')

// project modules
const { TOKEN, PREFIX, URL, CHANNEL_ID } = require('./config.json')
const { commands, permissions } = require('./modules')

// connect bot
if (!TOKEN || TOKEN === '') log('no token', 'red')
let bot = new Eris(TOKEN)
bot.connect()

// events
bot.on('disconnect', () => {
  log('disconnected', 'red')
})

bot.on('error', console.error)

bot.on('ready', () => {
  log('online', 'green')
  // setGame()
})

bot.on('messageCreate', async (msg) => {
  if (!msg.member || msg.member.id === bot.user.id) return

  let params = msg.content.substring(PREFIX.length).split(' ')
  let command = commands[params.splice(0, 1)[0]]; if (!command) return
  let fullParam = params.join(' ')

  msg.delete().catch((e) => log('cannot delete messages', 'yellow'))

  if (params.length < command.parameters.length) {
    return msg.channel.createMessage(msg.author.mention + ' insufficient parameters!')
    .then((m) => setTimeout(() => m.delete(), 10000))
  }

  let perm = permissions[command.permission]
  if (!await allow(perm, msg)) {
    return msg.channel.createMessage(msg.author.mention + ' ' + perm.deny())
    .then((m) => setTimeout(() => m.delete(), 10000))
  }

  if (command.name === 'help') params = commands
  command.run({ channelId: CHANNEL_ID, url: URL, msg, params, fullParam, guild: msg.channel.guild, channel: msg.channelMentions[0], commands })
  .then(({ content, embed, delay = 10000 }) => {
    if (!content) return
    if (embed) {
      content = msg.author.mention + ' ' + content
      return msg.channel.createMessage({ content, embed })
      .then((m) => { if (delay) setTimeout(() => m.delete(), delay) })
      .catch(console.error)
    }
    msg.channel.createMessage(msg.author.mention + ' ' + content)
    .then((m) => { if (delay) setTimeout(() => m.delete(), delay) })
    .catch(console.error)
  })
})

// helpers
// function setGame () {
//   let name = games[Math.floor(rng() * games.length)]
//   log(`playing ${name}`, 'cyan')
//   bot.editStatus('online', { name })
//   setTimeout(setGame.bind(), 43200000) // 43200000
// }

function log (str, color) {
  if (typeof str !== 'string') {
    str = str.toString()
  }
  console.log(
    colors.gray(`${moment().format('MM/DD HH:mm:ss')}`) + ' | ' + colors[color](
      `BZZT ${str.toUpperCase()} BZZT`
    )
  )
}

async function allow (perm, msg) {
  let keys = Object.keys(permissions)
  for (let i = keys.indexOf(perm.name); i < keys.length; i++) {
    if (await permissions[keys[i]].check(msg.member)) return true
  }
  return false
}
