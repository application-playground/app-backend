const userModel = require('./../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
module.exports = {
    create: function (req, res, next) {

        let passwordHash = bcrypt.hashSync(req.body.password, 10);
        userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: passwordHash
        }, function (err, result) {
            if (err)
                next(err);
            else {
                if (result !== null) {
                    res.json({
                        status: true,
                        message: "Registration successfully!!",
                        user: {
                            email: result.email,
                            name: result.name
                        }
                    });
                } else {
                    res.json({
                        status: false,
                        message: "Please contact administrator!!",
                        user: {
                            email: req.body.email,
                            name: req.body.name
                        }
                    });
                }
            }
        });
    },
    authenticate: function (req, res, next) {
        console.log(req.body);
        userModel.findOne({
            email: req.body.email
        }, (err, userInfo) => {
            if (err) {
                next(err);
            } else {

                //validPassword = false;
                if (userInfo !== null) {

                    bcrypt.compare(req.body.password, userInfo.password, (err, result) => {
                        if (result) {
                            const token = jwt.sign({
                                id: userInfo
                            }, req.app.get('secretKey'), {
                                expiresIn: '1h'
                            });
                            res.json({
                                status: true,
                                token: token,
                                message: "Login successfully.",
                                user: {
                                    email: userInfo.email,
                                    name: userInfo.name
                                }
                            });
                        }
                    });

                } else {
                    res.json({
                        status: false,
                        token: null,
                        message: "Invalid login.",
                        user: {
                            email: req.body.email
                        }
                    });
                }
            }
        });
    },
    list: function (req, res, next) {

        var pageNo = parseInt(req.query.pageNumber)
        var size = parseInt(req.query.pageSize)

        var query = {}
        if (pageNo < 0 || pageNo === 0) {
            response = {
                "error": true,
                "message": "invalid page number, should start with 1"
            };
            return res.json(response)
        }
        query.skip = size * (pageNo - 1)
        query.limit = size
        // Find some documents
        userModel.count({}, function (err, totalCount) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                }
            }
            userModel.find({}, {}, query, function (err, data) {
                // Mongo command to fetch all data from collection.
                if (err) {
                    response = {
                        "error": true,
                        "message": "Error fetching data"
                    };
                } else {
                    var totalPages = Math.ceil(totalCount / size)
                    response = {
                        "error": false,
                        "message": data,
                        "pages": totalPages,
                        "totalElement": totalCount
                    };
                }
                res.json(response);
            });
        })

    }
}