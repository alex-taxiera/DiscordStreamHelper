exports.up = (knex) => {
  return knex.schema.table('guild', (t) => {
    t.string('announceChannel')
    t.string('streamLink')
  })
}

exports.down = (knex) => {
  return knex.schema.table('guild', function (t) {
    t.dropColumn('announceChannel')
    t.dropColumn('streamLink')
  })
}
