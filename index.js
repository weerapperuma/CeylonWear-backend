const express = require('express')
const mongoose = require("mongoose");
const app = express()
const port = process.env.PORT || 5000;

main().then(()=> console.log('Mongo Db Connected successfully')).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://admin:eYdrehgXoEb7kzTu@ceylonwear.4rg03.mongodb.net/?retryWrites=true&w=majority&appName=CeylonWear');

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
}
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})