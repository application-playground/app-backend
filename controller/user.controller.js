const userModel = require('./../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
module.exports = {
    create: function (req, res, next) {

        let passwordHash = bcrypt.hashSync(req.body.password, 10);
        userModel.create({ name: req.body.name, email: req.body.email, password: passwordHash }, function (err, result) {
            if (err)
                next(err);
            else
                res.json({ status: "success", message: "User added successfully!!!", data: null });

        });
    },
    authenticate: function (req, res, next) {
        userModel.findOne({ email: req.body.email }, (err, userInfo) => {
            if (err) {
                next(err);
            } else {
                
                //validPassword = false;
                bcrypt.compare(req.body.password, userInfo.password, (err, result) => {

                    if (result) {
                        const token = jwt.sign({ id: userInfo }, req.app.get('secretKey'), { expiresIn: '1h' });
                        res.json({ status: "success", message: "user found!!!", data: { user: userInfo, token: token } });
                    } else {
                        res.json({ status: "error", message: "Invalid email/password!!!", data: null });
                    }
                });
            }
        });
    },
}