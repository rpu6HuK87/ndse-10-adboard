module.exports = (req, res, next) => {

  const exceptions = ['/api/user/login', '/api/user/register', '/api/user/forgetpwd', '/user/login', '/user/register' ,'/user/forgetpwd']
  const pathname = req.path.split('/')
  console.log(req.isAuthenticated())

  if(pathname[1] == 'static' || exceptions.includes(req.path) || (req.isAuthenticated())) {
    next()
  } else {
    if(pathname[1] === 'api') {      
      res.status(401).json({status: 'Unauthorized'})
    } else {
      if (req.session) {
        req.session.returnTo = req.originalUrl || req.url
      }
      res.redirect('/user/login')     
    } 
  }  
}