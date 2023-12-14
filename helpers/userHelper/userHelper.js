const db = require('../../config/dbConnection')

const bcrypt = require('bcrypt');


const saltRounds = 10;


const signup = (data) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(data.password, saltRounds).then(function (hash) {
            // Store hash in your password DB.
            data.password = hash;
            db.get().collection('user').insertOne(data).then((result) => {
                resolve("success")
            }).catch((err)=>{
                if(err.code===11000){
                    reject('email is already registered')
                }else{
                    reject('error')
                }
            })
        });
    })
}
const login = (data) => {
    return new Promise((resolve, reject) => {
        db.get().collection('user').findOne({email : data.email}).then((result) => {
            if (result != null) {
                bcrypt.compare(data.password, result.password).then(function (result) {
                    // result == true
                    if (result) {
                        resolve({success:true,data:{
                            name:result.name
                        }})
                    } else {
                        resolve({success:false})
                    }

                });
 
            }else{
                resolve({success:false})
            }
        })
    })
}


module.exports = {
    signup, login
}