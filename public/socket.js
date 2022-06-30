const socket = io()

//DATOS DEL PRODUCTO
const formProducts = document.querySelector('#formProducts')
const idProduct = document.querySelector('#idProduct')
const nameProduct = document.querySelector('#nameProduct')
const priceProduct = document.querySelector('#priceProduct')
const imgProduct = document.querySelector('#imgProduct')

//DATOS DEL USUARIO
const formMessages = document.querySelector('#formMessages')
const emailUser = document.querySelector('#emailUser')
const messageUser = document.querySelector('#messageUser')
const messagesAll = document.querySelector('#messagesAll')

function sendMessage(){
    
    try {
        const email = emailUser.value
        const message = messageUser.value

        socket.emit('client:message', {email, message})
    } catch (error) {
        console.log(`Error de comunicación ${error}`);
    }
}

function renderMessage(messageData){
    try {
         const html = messageData.map(message => {
            return (
                `<div>
                    <strong style="color: blue;" >${message.email}</strong>
                    <span style="color: brown;">[${message.date}]</span>
                    <i style="color: green;">${message.message}</i>
                </div>
                `
            )
        }).join('')

        messagesAll.innerHTML = html
        formMessages.reset()

    } catch (error) {
        console.log(`Error de comunicación ${error}`);
    }  
}

function sendProducts(){
    try {
        const nombre = nameProduct.value
        const precio = priceProduct.value
        const url = imgProduct.value

        socket.emit('server:products', {nombre, precio, url})

    } catch (error) {
        console.log(`Error de comunicación ${error}`)
    }
}
async function renderProducts(products) {

    const res = await fetch('/productsTemplate.hbs')
    const plantilla = await res.text()
    document.querySelector('#tableProducts').innerHTML = ''

    products.forEach(product => {
        const template = Handlebars.compile(plantilla)
        const html = template(product);
        document.querySelector('#tableProducts').innerHTML += html
    })
    formProducts.reset()
}

formProducts.addEventListener('submit', e => {
    e.preventDefault()
    sendProducts()
})

formMessages.addEventListener('submit', e => {
    e.preventDefault()
    sendMessage()
})

socket.on('server:products', renderProducts)
socket.on('server:message', renderMessage)