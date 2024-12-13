const express = require('express')
const router = require('./routers/apiRouter')

const app = express()

app.use(express.static('public'));
app.use(express.json());

app.use('/api', router)


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Serwer dziala na porcie ${PORT}`)
})