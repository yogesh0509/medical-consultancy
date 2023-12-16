const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const user = require("../models/userModel");
const doubt = require("../models/doubtModel")
const upload_files = require("../middleware/upload_files");

router.post("/signup", upload_files, (req, res, next) => {
    console.log(req.body)
    user.find({ email: req.body.email })
        .exec()
        .then(data => {
            if (data.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({
                            message: "There is an error",
                            error: err
                        });
                    } else {
                        const User = new user;
                        User._id = new mongoose.Types.ObjectId();
                        User.email = req.body.email;
                        User.password = hash;
                        User.location = 

                        User.save()
                            .then(result => {
                                res.status(200).json({
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});
router.post("/login", (req, res, next) => {
    console.log(req.body)
    user.find({ email: req.body.email })
        .exec()
        .then(data => {
            console.log(data)
            if (data.length < 1) {
                console.log(data)

                return res.status(401).json({
                    message: "mail does not exist",
                });
            }
            bcrypt.compare(req.body.password, data[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed",
                        error: err
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            _id: data[0]._id,
                            email: data[0].email,
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "24h"
                        }
                    );
                    console.log({
                        message: "Auth successful",
                        token: token,
                    })

                    res.cookie('access_token', token, {
                        expires: new Date(Date.now() + 86400000)
                    });

                    res.status(200).json({
                        message: "Correct Credentials",
                    })
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
});

router.get("/get_doubts", (req, res, next) => {
    doubt.find({})
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "fetch Success",
                data: result
            })
        })
        .catch((err) => {
            res.status(404).json({
                message: "fetch failed",
                error: err
            })
        })
})

router.post("/save_doubt", (req, res, next) => {
    const Doubt = new doubt;
    Doubt._id = new mongoose.Types.ObjectId();
    Doubt.question = req.body.question;
    Doubt.save()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: "Doubt saved"
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
})

router.post("/save_answer",
    (req, res, next) => {
        const token = req.cookies.access_token
        jwt.verify(token, process.env.JWT_KEY, (err, authorizedData) => {
            if (err) {
                res.status(403).json({
                    message: "Failed to authorize",
                    error: err
                });
            } else {
                next();
            }
        })
    }, (req, res, next) => {
        doubt.findOne({ _id: req.body.id })
            .exec()
            .then((data) => {
                data.answer = req.body.answer;
                data.save()
                    .then((user) => {
                        console.log(user)
                        res.status(200).json({
                            message: "Update Success",
                            data: user
                        })
                    })
                    .catch((err) => {
                        res.status(404).json({
                            message: "Update failed",
                            error: err
                        })
                    })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    })

module.exports = router;