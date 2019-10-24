const userModel = require('./../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const escapeRegex = (string) => {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

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

        var pageNo = parseInt(req.query.pageNumber);
        var size = parseInt(req.query.pageSize);
        var sorting = req.query.sortOrder;
        
        let sortParams = {};
        var sortField = undefined;
        var search = {};

        if (!(req.query.search == " ")) {
            search = { name: new RegExp( '^'+ escapeRegex( req.query.search), '') };
        }

        var query = {}
        if (pageNo < 0) {
            response = { "error": true, "message": "invalid page number, should start with 1" };
            return res.json(response)
        }

        query.skip = size * (pageNo)
        query.limit = size
        // console.log(req.query);
        if (sorting !== undefined) {
            sortParams = { [sorting.split(',')[0]]: sorting.split(',')[1] === 'asc' ? 1 : -1 };
        }

        // Find some documents
        userModel.countDocuments(search, function (err, totalCount) {
            if (err) {
                response = { "error": true, "message": "Error fetching data" }
            }
            userModel.find(search, {}, query, function (err, data) {
                // Mongo command to fetch all data from collection.
                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {
                    var totalPages = Math.ceil(totalCount / size)
                    response = { "error": false, "message": data, "pages": totalPages, "totalElement": totalCount };
                }
                res.json(response);
            }).sort(sortParams);
        });

    },
    exportCSV: function (req, res, next) {
        userModel.find({}, { 'name': 1, 'email': 1, '_id': 0 }, function (err, data) {
            if (err) {
                response = { "error": true, "message": "Error fetching data" };
            } else {
                response = { "error": false, "message": data };
            }
            res.json(response);
        });
    }
}