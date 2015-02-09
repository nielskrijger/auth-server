'use strict';

var User = require('../models/User');

module.exports.postUser = function(req, res, next) {
    //User.createNew(req.body.user, )
    console.log(req.body);
    res.status(200).json({'bliep': 'blaat'});
};
