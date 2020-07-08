const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let entries = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/api/persons', (req, res) => {
  res.json(entries)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const entry = entries.find(entry => entry.id === id)

  if (entry) {
    res.json(entry)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const name = req.body.name
  const number = req.body.number
  const id = Math.ceil(Math.random() * 1e9)

  if (!name) {
    res.status(400).json({ 'error': 'name missing' }).end()
  } else if (!number) {
    res.status(400).json({ 'error': 'number missing' }).end()
  }
  else if (entries.find(entry => entry.name.toLowerCase() === name.toLowerCase())) {
    res.status(409).json({ 'error': 'name must be unique' }).end()
  } else {
    if (name && number) {
      const newEntry = {
        "name": name,
        "number": number,
        "id": id
      }
      entries.push(newEntry)

      res.status(204).end()
    }
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  entries = entries.filter(entry => entry.id !== id)

  res.status(204).end()
})

app.get('/info', (req, res) => {
  const infoline = `Phonebook has info for ${entries.length} people`
  res.send(`<p>${infoline}</p><p>${new Date().toString()}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
