const sendErrorDev = (err,res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

export const globalErrorHandler = (err,req,res,next)=>{
    sendErrorDev(err,res)
}