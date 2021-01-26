const express = require('express')
const app = express()

const path =  require('path')
const {v4 : uuidv4 } = require('uuid')



//Middlewares
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'./public')))

// Routes

app.get('/',(req,res) => {
    res.redirect(`/${uuidv4()}`)
})


app.get('/:room',(req,res) => {
    res.render('room',{roomId : req.params.room})
})


app.listen(3000,() => {
    console.log(`server is running `)
})