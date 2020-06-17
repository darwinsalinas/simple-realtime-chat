const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Nombre de usuario requerido']
    },
    id: {
        type: String,
        required: [true, 'Id de usuario requerido']
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = User