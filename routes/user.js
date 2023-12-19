var express = require('express');
const { MongoClient } = require('mongodb');
const userhelper=require('../helpers/userHelper/userHelper')

var router = express.Router();
const verifyLogin = (req, res, next) => {
  if (req.session.userStatus) {
    next()
  } else {
    res.redirect('/login')
  }
}


/* GET home page. */
router.get('/signup', function(req, res, next) {
    if(req.session.userStatus){
      res.redirect('/home')
    }else{
      if(req.session.signupError){
       
        var msg=req.session.errmsg
        
      req.session.signupError=false
      req.session.errmsg=""
      }
    }
    res.set('Cache-Control', 'no-store')
  res.render('user/signup',{error:msg});
    
});
router.post('/signup',function(req,res) {
  console.log(req.body);
  userhelper.signup(req.body).then(()=>{
    res.json({success:true})
  }).catch((msg)=>{
    req.session.signupError=true
    req.session.errmsg=msg
    res.json({ success: false })
  })
 
})
router.get('/login',(req,res)=>{
  if(req.session.userStatus){
    res.redirect('/home')
  }if (req.session.userLoginError) {
    var error = "email or password is incorrect"
   
    req.session.userLoginError = false
  }
  res.set('Cache-Control', 'no-store')
  res.render('user/login',{error});
})


router.post('/login',(req,res)=>{
  console.log(req.body);
 
  userhelper.login(req.body).then((result)=>{
    console.log(result);
    if(result.success){
      req.session.user=result.data.name
      req.session.userStatus=result.success
      res.redirect('/home')
    }
    else {
      req.session.userLoginError = true
      res.redirect('/login')
    }
  
  })
})
router.get('/home',verifyLogin,(req,res)=>{
  res.set('Cache-Control', 'no-store')
  res.render('user/home',{ name: req.session.user })
})
router.get('/logout',verifyLogin,(req,res)=>{
  req.session.destroy(()=>{
    res.redirect('/login')
  })
})



module.exports = router;
