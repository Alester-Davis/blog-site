const sendErrorDev = (err,res)=>{
    console.log("send",err)
    res.status(err.statusCode|| 404).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

export const globalErrorHandler = (err,req,res,next)=>{
    sendErrorDev(err,res)
}