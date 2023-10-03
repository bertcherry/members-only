const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Message = require('../models/message');

exports.message_delete_post = asyncHandler(async (req, res, next) => {
    await Message.findByIdAndRemove(req.body.messageid);
    res.redirect('/');
});