const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const MessageSchema = new Schema({
    title: { type: String, required: true, maxLength: 100 },
    text: { type: String, required: true },
    time: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

MessageSchema.virtual('time_formatted').get(function() {
    return DateTime.fromJSDate(this.time).toLocaleString(DateTime.DATETIME_FULL);
});

MessageSchema.virtual('url').get(function() {
    return `messages/${this._id}`;
});

module.exports = mongoose.model('Message', MessageSchema);