import { join } from 'path'
import { load } from 'docker-secret-env'

import {
  DataClient,
  SQLManager
} from 'eris-boiler'

import {
  oratorOptions,
  statusManagerOptions
} from './config'
import { ENV } from './types/env'

load()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const {
  DISCORD_TOKEN,
  DB_CLIENT,
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_CONNECTION
} = process.env as unknown as ENV

/* create DataClient instance */
const bot = new DataClient(DISCORD_TOKEN, {
  oratorOptions,
  statusManagerOptions,
  erisOptions: { disableEveryone: false },
  databaseManager: new SQLManager({
    connectionInfo: DB_CONNECTION || {
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASS,
      host: DB_HOST
    },
    client: DB_CLIENT,
    pool: {
      min: 0
    }
  })
})

bot
  .addCommands(join(__dirname, 'commands'))
  .addSettingCommands(join(__dirname, 'settings'))
  .connect()
