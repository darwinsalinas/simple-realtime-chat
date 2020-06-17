const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChatSchema = new Schema({
    message: {
        type: String,
        required: [true, 'Mensaje requerido']
    },
    user_id: {
        type: String,
        required: [true, 'Id de usuario requerido']
    },
    nombre: {
        type: String,
        required: [true, 'Nombre de usuario requerido']
    },
})

const Chat = mongoose.model('Chat', ChatSchema)

module.exports = Chat