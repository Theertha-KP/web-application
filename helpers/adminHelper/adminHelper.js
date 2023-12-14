const { ObjectId } = require('mongodb')
const db=require('../../config/dbConnection')

const bcrypt=require('bcrypt')
const login=(data)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection('admin').findOne({username : data.username}).then((result) => {
            if (result != null) {
               
                bcrypt.compare(data.password, result.password).then(function (result) {
                    // result == true
                    if (result) {
                        resolve({success:true})
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
var getUser=()=>{
    return new Promise(async(resolve,reject)=>{
        users=await db.get().collection('user').find().toArray()
        console.log(users);
        resolve(users)
    })
}
var findUser=(id)=>{
    return new Promise((resolve,reject)=>{
        id=new ObjectId(id)
        db.get().collection('user').findOne({_id: id}).then((result)=>{
            console.log(result);
            resolve(result)
        })
    })
}
var updateUser=(data)=>{
    return new Promise((resolve, reject) => {
        db.get().collection('user').updateOne({_id: new ObjectId(data.id)},{$set:{name: data.name, email: data.email}}).then((result)=>{
            console.log(result);
                resolve()

        }).catch((err)=>{
            if(err.code===11000){
                reject("email is already registered")
            }else{
                reject("error")
            }
        })
    })
}
var deleteUser=(id)=>{
    return new Promise((resolve,reject)=>{
        console.log(id);
        db.get().collection('user').deleteOne({_id: new ObjectId(id)}).then((result)=>{
            resolve()
        })
    })
}
module.exports={
    login,getUser,findUser,updateUser,deleteUser
}