var express = require('express');
var router = express.Router();
const adminhelper=require('../helpers/adminHelper/adminHelper');
// const { render } = require('../app');
const userhelper=require('../helpers/userHelper/userHelper')

const verifyLogin=(req,res,next)=>{
  if(req.session.adminStatus)
  next()
  else
  res.redirect('/admin/login')
}


/* GET users listing. */
router.get('/login', function(req, res, next) {
  if(req.session.adminStatus){
  res.redirect('/admin/dashboard')
  }else{
    if(req.session.adminError){
      var error = "Incorrect user name or password"
      req.session.adminError = false
    }
    res.set('Cache-Control', 'no-store')
    res.render('admin/login', { error })
  }

});
router.post('/login',(req,res)=>{
  adminhelper.login(req.body).then((result)=>{
    console.log(result);
    if(result.success){
     
      req.session.adminStatus=true
    res.redirect('/admin/dashboard')
    }
    else{
      req.session.adminError=true
      res.redirect('/admin/login')
    }

  })
})
router.get('/dashboard',verifyLogin,function (req,res){
 adminhelper. getUser().then((users)=>{
  res.set('Cache-Control', 'no-store')
    res.render('admin/dashboard',{users,admin:true})
  })
}) 
router.get('/create',verifyLogin,function(req,res){
  if(req.session.createError){
    var msg=req.session.errmsg
    req.session.createError=false
    req.session.errmsg=""
  }
  
  res.render('admin/create',{admin:true, error:msg})
}
)
router.post('/create',function(req,res){
  userhelper.signup(req.body).then((result)=>{
    res.redirect('/admin/dashboard')
  }).catch((msg)=>{
    req.session.createError=true
    req.session.errmsg=msg
    res.redirect('/admin/create')
  })
  
})
router.get('/edit/:id',verifyLogin,(req,res)=>{
  adminhelper.findUser(req.params.id).then((user)=>{
    res.render('admin/editboard',{user,admin:true})
  })
})
router.post('/update',(req,res)=>{
  adminhelper.updateUser(req.body).then(()=>{
    res.redirect('/admin/dashboard')
  })
})
router.get('/delete',verifyLogin,(req,res)=>{
  adminhelper.deleteUser(req.query.id).then(()=>{
    res.redirect('/admin/dashboard')
  })
})
router.get('/logout',verifyLogin,(req,res)=>{
  req.session.destroy(()=>{
    res.redirect('/admin/login')
  })
})

module.exports = router;
