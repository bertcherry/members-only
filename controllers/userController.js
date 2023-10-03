const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

exports.user_create_get = (req, res, next) => {
    res.render('user_form', {title: 'Sign Up'});
};

exports.user_create_post = [
    body('first_name', 'First name is required.').trim().notEmpty().escape(),
    body('last_name', 'Last name is required.').trim().notEmpty().escape(),
    body('email')
        .trim().notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Must be a valid email address.')
        .custom(async value => {
            const emailUsed = await User.find({ email: value });
            if (emailUsed) {
                throw new Error('E-mail already in use');
            }
        })
        .escape(),
    body('password', 'Password must be at least 8 characters long.').trim().isLength({ min: 8 }).escape(),
    body('password_confirm', 'Passwords must match.').trim().custom((value, { req }) => {return value === req.body.password}).escape(),
    body('member_code').trim().escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        brcypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                return next(err);
            }
            else return hashedPassword;
        });
        let isMember;
        if (req.body.member_code === process.env.MEMBER_CODE) {
            return isMember = true;
        } else {
            isMember = false;
        }
        const user = new User({
            first_name: req.body.first_name, 
            last_name: req.body.last_name,
            email: req.body.email,
            password: hashedPassword,
            membership_status: isMember,
        });
        
        if (!errors.isEmpty()) {
            res.render('user_form', {
                title: 'Sign Up',
                user,
                errors: errors.array()
            });
        } else {
            await user.save();
            res.redirect('/login');
        }
    }),
];