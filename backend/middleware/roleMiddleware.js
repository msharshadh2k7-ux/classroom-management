const isCR = (req,res,next)=>{
    if(req.user.role !== "CR"){
        return res.status(403).json({
            message: "Access Denied. Only CR can perform this action."
        });
    }
    next();
};

module.exports = isCR;
