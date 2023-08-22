// module.exports=func=>{
//   return(req,res,next)=>{
//     func(req,res,next).catch(next);
//   }
// }

module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .then((result) => {
      // do something with the result
    })
    .catch((err) => next(err));
};
