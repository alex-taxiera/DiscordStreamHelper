const Permission = require('./Permission.js')
const { VIP_ID } = require('../../config.json')

module.exports = new Permission({
  name: 'VIP',
  check: async (member) => {
    if (member.roles.includes(VIP_ID)) return true
    return false
  },
  deny: () => 'Must be VIP!'
})
