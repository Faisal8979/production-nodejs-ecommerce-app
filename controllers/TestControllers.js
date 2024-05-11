 const TestControllers = (req, res) =>{
    res.status(200).send({
        message: "Test Routes",
        success: true,
    })
}

module.exports= TestControllers;