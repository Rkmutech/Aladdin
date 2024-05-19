const express = require('express');
const nodemailer = require('nodemailer');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aladdin'
});

exports.register = (req, res) => {
    console.log(req.body);
    
 

    const { first_name, last_name, dob, gender, email, phoneno, pass, cfm_pass, door, street, state, city, pin } = req.body;

    db.query('select email from register where email= ?', [email], (error, results) => {
        if (error) {
            console.log(error)
        } else if (results.length > 0) {
            return res.render('register', {
                message: "This email is already Registered"
            });
        } else if (pass != cfm_pass) {
            return res.render('register', {
                message: "Passwords do not Match"
            });
        } else {
            db.query('select phoneno from register where phoneno= ?', [phoneno], (error, results) => {
                if (error) {
                    console.log(error)
                } else if (results.length > 0) {
                    return res.render('register', {
                        message: "This Phone Number is already Registered"
                    });
                } else {
                    db.query('insert into register set ?', { first_name: first_name, last_name: last_name, dob: dob, gender: gender, email: email, phoneno: phoneno, pass: pass, door: door, street: street, state: state, city: city, pin: pin }, (error, results) => {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log(results);
                            var nodemailer = require('nodemailer');
                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'ramkumarselvaraj3798@gmail.com',
                                    pass: 'Ram9751$'
                                }
                            });
                            var mailOptions = {
                                from: 'ramkumarselvaraj3798@gmail.com',
                                to: email,
                                subject: ' Registration confirmation Mail',
                                text: 'Welcome to Online Aladdin Website!'
                            };
                            transporter.sendMail(mailOptions, function(error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });
                            return res.render('register', {
                                message: "User Registered"
                            });
                        }
                    })
                }
            })
        }
    })
}

exports.signin = (req, res) => {
    console.log(req.body);

    const { uname, pass } = req.body;

    db.query('select * from register where email=? and pass=?', [uname, pass], (error, results) => {
        if (error) {
            console.log(error);
        } else if (results.length > 0) {
            return res.redirect('/Home');
        } else {
            db.query('select * from admin_register where email=? and pass=?', [uname, pass], (error, results) => {
                if (error) {
                    console.log(error);
                } else if (results.length > 0) {
                    return res.redirect('/AdminArea');
                } else {
                    return res.render('signin', {
                        message: "Invalid Username and password!"
                    });
                }
            });
        }
    });
}

exports.add = (req, res) => {
    console.log(req.body);

    const { pro_cat, pro_name, pro_desc } = req.body;

    if (!req.files) {
        return res.render('add', {
            message: "Please select a image to upload!"
        });
    }

    const file = req.files.pro_img;
    const img_name = file.name;

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
        file.mv('public/images/upload_images/' + file.name, function(error) {
            if (error) {
                console.log(error);
            } else {
                db.query('insert into product set ?', { pro_cat: pro_cat, pro_name: pro_name, pro_img: img_name, pro_desc: pro_desc }, (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(results);
                        return res.render('add', {
                            message: "Product uploaded!"
                        });
                    }
                });
            }
        });
    } else {
        return res.render('add', {
            message: "This format is not allowed , please upload file with '.png','.gif','.jpg'"
        });
    }
}

exports.editproduct = (req, res) => {
    console.log(req.body);

    const { pro_id, pro_cat, pro_name, pro_desc } = req.body;

    if (!req.files) {
        db.query('update product set pro_cat=?, pro_name=?, pro_des=? where pro_id = ?', [pro_cat, pro_name, pro_desc, pro_id], (error) => {
            if (error) {
                console.log(error);
            } else {
                db.query('select * from product where pro_id=?', [pro_id], (error, results) => {
                    console.log(results);
                    return res.render('editproduct', {
                        message: "Product updated!",
                        editproductData: results
                    });
                })
            }
        })
    } else {
        const file = req.files.pro_img;
        const img_name = file.name;

        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
            file.mv('public/images/upload_images/' + file.name, function(error) {
                if (error) {
                    console.log(error);
                } else {
                    db.query('update product set pro_cat=?, pro_name=?, pro_img=?, pro_des=? where pro_id = ?', [pro_cat, pro_name, img_name, pro_desc, pro_id], (error) => {
                        if (error) {
                            console.log(error);
                        } else {
                            db.query('select * from product where pro_id=?', [pro_id], (error, results) => {
                                console.log(results);
                                return res.render('editproduct', {
                                    message: "Product updated!",
                                    editproductData: results
                                });
                            })
                        }
                    })
                }
            })
        }

    }
}

exports.editinventory = (req, res) => {
    console.log(req.body);

    const {inventory_id, quantity, pro_price, pro_availability} = req.body;

    db.query('update inventory set quantity=?, pro_price=?, pro_availability=? where inventory_id = ?', [quantity, pro_price, pro_availability, inventory_id], (error,results)=>{
        if(error){
            console.log(error);
        }
        else{
            console.log(results);
            db.query('select p.*, i.* from product p, inventory i where i.inventory_id=? and p.pro_id=i.pro_id', [inventory_id], (error, data)=> {
                return res.render('editinventory', {
                    message:"Product Inventory updated!", editinventoryData: data})
            });                
        }
    });
}

exports.addtoinventory=(req,res)=>{
    console.log(req.body);

    const {pro_id, quantity, pro_price, pro_availability} = req.body;

    db.query('insert into inventory set ?', {pro_id: pro_id, quantity: quantity, pro_price: pro_price, pro_availability: pro_availability}, (error,results)=>{
        if(error){
            console.log(error);
        }
        else{
            console.log(results);
            db.query('select * from admin_register', (error, admindata)=> {
                db.query('select p.*, i.* from product p, inventory i where i.pro_id=? and i.pro_id=p.pro_id', [pro_id], (error, data)=> {
                    return res.render('addtoinventory', {
                        message:"Product Inventory uploaded!", addtoinventoryData: data, adminData: admindata
                    })
                });
            })
        }
    });
}