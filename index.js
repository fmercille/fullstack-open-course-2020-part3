const express = require('express')
const app = express()

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
