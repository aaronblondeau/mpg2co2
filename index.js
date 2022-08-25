require('dotenv').config()
const express = require('express')
const app = express()
const terminus = require('@godaddy/terminus')
const _ = require('lodash')

const port = parseInt(process.env.PORT || '3000')
const { Pool } = require('pg')

// You need to configure PG... env vars to configure credentials
const pool = new Pool({ max: 5, ssl: process.env.PGSSL === 'yes' })

// TODO : 
// https://pm2.keymetrics.io/docs/usage/signals-clean-restart/
// pool.connect((err, client, release) => {
//   console.log('~~ Database ready')
//   process.send('ready')
// })

app.use(express.static('public'))

app.get('/healthz', async (req, res) => {
  const data = await pool.query('SELECT NOW()')
  res.send({ now: data.rows[0].now })
})

app.get('/years', async (req, res) => {
  const data = await pool.query('SELECT distinct(year) as year FROM vehicles ORDER BY year ASC')
  const years = _.map(data.rows, (row) => {
    return row.year
  })
  res.send(years)
})

app.get('/year/:year/makes', async (req, res) => {
  const data = await pool.query('SELECT distinct(make) as make FROM vehicles WHERE year = $1 ORDER BY make ASC', [req.params.year])
  const makes = _.map(data.rows, (row) => {
    return row.make
  })
  res.send(makes)
})

app.get('/year/:year/make/:make/models', async (req, res) => {
  const data = await pool.query('SELECT distinct(model) as model FROM vehicles WHERE year = $1 AND make = $2 ORDER BY model ASC', [req.params.year, req.params.make])
  const models = _.map(data.rows, (row) => {
    return row.model
  })
  res.send(models)
})

app.get('/year/:year/make/:make/model/:model', async (req, res) => {
  const data = await pool.query('SELECT * FROM vehicles WHERE year = $1 AND make = $2 AND model = $3', [req.params.year, req.params.make, req.params.model])
  res.send(data.rows[0])
})

const server = app.listen(port, () => {
  console.log(`mpg2co2 listening on port ${port}`)
})

// PM2 Graceful Shutdown : https://pm2.keymetrics.io/docs/usage/signals-clean-restart/
terminus.createTerminus(server, {
  signal: 'SIGINT',
  signals: ['SIGUSR1', 'SIGUSR2'],
  timeout: 31000,
  onSignal: async () => {
    // Cleanup all resources
    console.log('~~ Terminus signal : cleaning up...')

    await pool.end()
    console.log('~~ Database connection closed')

    await server.close()
    console.log('~~ HTTP server closed')
  },
  onShutdown: async () => {
    console.log('~~ Terminus shutdown complete.')
  }
})