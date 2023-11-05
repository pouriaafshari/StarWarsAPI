
const express = require('express')
const filterRouter = require('./routes/filter')
const searchRouter = require('./routes/search')
const swRouter = require('./routes/sw')
const app = express()
app.use(express.json())
app.use("/search", searchRouter)
app.use("/filter", filterRouter)
app.use("/sw", swRouter)

app.listen(3000)