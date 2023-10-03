const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Message = require('../models/message');

exports.message_create_get = (req, res, next) => {
    res.render('message_form', {title: 'Write a Message'});
};

exports.message_create_post = [
    body('title', 'Message title is required.').trim().notEmpty().escape(),
    body('text', 'Message body is required.').trim().notEmpty().escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        const message = new Message({
            title: req.body.title, 
            text: req.body.text,
            time: new Date(),
            author: currentUser._id,
        });
        
        if (!errors.isEmpty()) {
            res.render('message_form', {
                title: 'Write a Message',
                message,
                errors: errors.array()
            });
        } else {
            await message.save();
            res.redirect('/');
        }
    }),
];

exports.message_delete_post = asyncHandler(async (req, res, next) => {
    await Message.findByIdAndRemove(req.body.messageid);
    res.redirect('/');
});