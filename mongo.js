const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> [name number]')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.uo4ks.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length === 3) {
  // list entries rather than create a new one
  Entry.find({}).then(entries => {
    console.log('Phonebook:')
    entries.forEach(entry => {
      console.log(`${entry.name}   ${entry.number}`)
    })

    mongoose.connection.close()
  })

} else if (process.argv.length === 5) {
  // name is argv[3]
  // number is argv[4]

  const name = process.argv[3]
  const number = process.argv[4]

  const entry = new Entry({
    name: name,
    number: number,
  })

  entry.save().then(() => {
    console.log(`added ${name} number ${number} to the phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Please call this script as either "node mongo.js <password>" or "node mongo.js <password> name number"')
  mongoose.connection.close()
}
