import { join } from 'path'

import {
  DataClient,
  SQLManager
} from 'eris-boiler'

import {
  oratorOptions,
  statusManagerOptions
} from './config'
import { ENV } from './types/env'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const {
  STREAM_DISCORD_TOKEN,
  STREAM_DB_CLIENT,
  STREAM_DB_NAME,
  STREAM_DB_USER,
  STREAM_DB_PASS,
  STREAM_DB_HOST,
  STREAM_DB_CONNECTION
} = (process.env as unknown) as ENV

/* create DataClient instance */
const bot = new DataClient(STREAM_DISCORD_TOKEN, {
  oratorOptions,
  statusManagerOptions,
  erisOptions: { disableEveryone: false },
  databaseManager: new SQLManager({
    connectionInfo: STREAM_DB_CONNECTION || {
      database: STREAM_DB_NAME,
      user: STREAM_DB_USER,
      password: STREAM_DB_PASS,
      host: STREAM_DB_HOST
    },
    client: STREAM_DB_CLIENT,
    pool: {
      min: 0
    }
  })
})

bot
  .addCommands(join(__dirname, 'commands'))
  .addSettingCommands(join(__dirname, 'settings'))
  .connect()
