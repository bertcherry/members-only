const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    last_name: { type: String, required: true, maxLength: 100 },
    email: { type: String, required: true },
    password: { type: String, required: true },
    membership_status: { type: Boolean },
    admin: { type: Boolean }
});

UserSchema.virtual('full_name').get(function() {
    return this.first_name + ' ' + this.last_name;
});

module.exports = mongoose.model("User", UserSchema);