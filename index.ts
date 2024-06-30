
import express from 'express'

const app = express()

app.use('/', (req, res) => {
    return res.json('Hello to the app')
})

app.listen(8080, ()=> {
})