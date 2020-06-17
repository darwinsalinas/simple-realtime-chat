const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require("body-parser");

const usuarios = []
const mensajes = []


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (request, response) => {
    console.log('index')
    response.sendFile(__dirname + '/index.html')
})

app.post('/', (request, response) => {
    const {nombre} = request.body
    response.redirect(`/chat?nombre=${nombre}`)
})

app.get('/chat', (request, response) => {
    response.sendFile(__dirname + '/chat.html')
})

io.on('connection', (socket) => {

    io.emit('mensajes', mensajes)

    socket.on('crear-usuario', (nombre) => {
        const usuario = {
            id: socket.id,
            nombre: nombre
        }
        usuarios = [...usuarios, usuario]
        io.emit('usuarios-conectados', usuarios)
    })

    socket.on('disconnect', () => {
        usuarios = usuarios.filter(it => it.id !== socket.id)
        io.emit('usuarios-conectados', usuarios)
    })

    socket.on('new-message', (mensaje) => {
        const newmensaje = {
            user_id: socket.id,
            mensaje: mensaje
        }
        mensajes = [...mensajes, newmensaje]
        io.emit('new-message', mensaje)
    })
})

http.listen(4000, () => {
    console.log('corriendo en el puerto 4000')
})