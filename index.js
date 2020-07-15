require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Entry = require('./models/entry')
const { response } = require('express')

app.use(cors())
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
  Entry.find({}).then(entries => {
    res.json(entries)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Entry.findById(req.params.id).then(entry => {
    res.json(entry)
  },
    error => {
      res.status(404).end()
    })
})

app.post('/api/persons', (req, res) => {
  const name = req.body.name
  const number = req.body.number

  if (!name) {
    res.status(400).json({ 'error': 'name missing' }).end()
  } else if (!number) {
    res.status(400).json({ 'error': 'number missing' }).end()
  }
  else {
    Entry.findById(req.params.id).then(entry => {
      console.log('Found', entry)
      if (entry) {
        res.status(409).json({ 'error': 'name must be unique' }).end()
      } else {
        if (name && number) {
          const entry = new Entry({
            name: name,
            number: number
          })

          entry.save().then(savedEntry => {
            res.status(204).end()
          })
        }
      }
    })
  }
})



app.delete('/api/persons/:id', (req, res) => {
  res.status(501).end()
})

app.get('/info', (req, res) => {
  const numEntries = Entry.find({}).then(entries => {
    const infoline = `Phonebook has info for ${entries.length} people`
    res.send(`<p>${infoline}</p><p>${new Date().toString()}</p>`)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
