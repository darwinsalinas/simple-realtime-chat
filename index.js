const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin:admin@cluster0-9fu6k.mongodb.net/chat_sgu?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const User = require('./src/models/User')
const Chat = require('./src/models/Chat')

// const changeStream = User.watch()
// const chatChangeStream = Chat.watch()

// chatChangeStream.on('change', (change) =>{
//     console.log(change)
//     io.emit('changeData', change)
// })


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (request, response) => {
    console.log('index')
    response.sendFile(__dirname + '/src/templates/index.html')
})

app.post('/', (request, response) => {
    const {nombre} = request.body
    response.redirect(`/chat?nombre=${nombre}`)
})

app.get('/chat', (request, response) => {
    response.sendFile(__dirname + '/src/templates/chat.html')
})

io.on('connection', (socket) => {

    User.find({}, (err, users) => {
        io.emit('usuarios', users)
    })

    Chat.find({}, (err,mensajes) => {
        io.emit('mensajes', mensajes)
    })

    socket.on('crear-usuario', (nombre) => {

        User.findOne({name: nombre}, (err, usuario) => {
            if(usuario){
                User.find({}, (err, usuarios)=>{
                    io.emit('usuarios-conectados', usuarios)
                })
            } else {
                const u = {
                    id: socket.id,
                    name: nombre
                }
                const user = new User(u);
                user.save().then(() => {
                    User.find({}, (err, usuarios) => {
                        io.emit('usuarios-conectados', usuarios)
                    })
                });

            }
        })
    })

    socket.on('disconnect', () => {
        console.log('usuario desconectado', socket.id)
        User.deleteOne({id: socket.id}, (err) => {
            User.find({}, (err, usuarios)=>{
                io.emit('usuarios-conectados', usuarios)
            })
        })
    })

    socket.on('new-message', (mensaje) => {
        const newmensaje = {
            user_id: socket.id,
            message: mensaje.text,
            nombre: mensaje.nombre
        }
        const chat = new Chat(newmensaje);
        chat.save().then(() => io.emit('new-message', newmensaje));
    })
})

http.listen(4000, () => {
    console.log('corriendo en el puerto 4000')
})