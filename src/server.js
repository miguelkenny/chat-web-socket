const express = require('express')
const fs = require('fs')
const {Server: IOServer} = require('socket.io')
const path = require('path')
const app = express()
const port = 8080
const serverExpress = app.listen(port, ()=> console.log(`Servidor escuchando puerto ${port}`))
const io = new IOServer(serverExpress)
const contenedor = require('../Container/Container')
const {products} = new contenedor()

let messages = JSON.parse(fs.readFileSync('./file/messageFile.json', 'utf-8'))

app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', socket => {
    console.log('New Connection!!!', socket.id);

    io.emit('server:products', products)
    io.emit('server:message', messages)

    socket.on('server:products', productsInfo => {
        const id = products.length ? ((products[products.length - 1].id) + 1) : products.length + 1
        productsInfo.id = id
        products.push(productsInfo)
        io.emit('server:products', products)
    })

    socket.on('client:message', messageInfo => {
        const date = new Date(Date.now()).toLocaleString().replace(',', '');
        messageInfo.date = date
        messages.push(messageInfo)
        fs.writeFileSync('./file/messageFile.json', JSON.stringify(messages), 'utf-8');
        io.emit('server:message', messages)
    })
})