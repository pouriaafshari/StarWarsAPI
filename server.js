
const express = require('express')
const filterRouter = require('./routes/filter')
const app = express()

app.use("/filter", filterRouter)

app.listen(3000)