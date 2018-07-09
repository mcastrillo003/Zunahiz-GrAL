'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

//
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
//

var UserSchema=Schema({
  firstName: String,
  lastName: String,
  lastName2: String,
  username: {
    type: String,
    unique: true,
    required: true
  },
  description: String,
  salt: String,//is a string of characters unique to each user.
  hash: String,//is created by combining the password provided by the user and the salt, and then applying one-way encryption
  argazkia: {type: Schema.ObjectId,ref: 'Image'},
  portada: {type: Schema.ObjectId,ref: 'Image'},
  semaforoak: {type: [Schema.ObjectId],ref: 'Semaphore'}
});

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    argazkia: this.argazkia,
    portada: this.portada,
    firstName: this.firstName,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

module.exports=mongoose.model('User',UserSchema);//Honek sortuko du User izeneko entitatea DBan
