
function checkAge(req, res, next) {
    const { age } = req.body;
  
    const currentDate = new Date();
    const birthDateObj = new Date(age);
  
    let personAge = currentDate.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDateObj.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDateObj.getDate())) {
      personAge--;
    }
  
    if (personAge < 18) {
      return res.status(400).json({ message: 'User must be 18 years or older to sign up' });
    }
    next();
  }
  


  module.exports={checkAge}