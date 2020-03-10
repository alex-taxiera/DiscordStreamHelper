if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const {
  NODE_ENV,
  STREAM_DB_CLIENT,
  STREAM_DB_NAME,
  STREAM_DB_USER,
  STREAM_DB_PASS,
  STREAM_DB_HOST,
  STREAM_DB_CONNECTION
} = process.env

module.exports = {
  [NODE_ENV]: {
    client: STREAM_DB_CLIENT,
    connection: STREAM_DB_CONNECTION || {
      host: STREAM_DB_HOST,
      database: STREAM_DB_NAME,
      user: STREAM_DB_USER,
      password: STREAM_DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
