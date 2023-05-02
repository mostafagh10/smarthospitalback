const router = require("express").Router();
const Message = require("../models/message");


//add
router.post('/', async (req,res) => {
    const newmessage = new Message(req.body);
    try {
        const savemessage = await newmessage.save();
        res.status(200).json(savemessage)
    } catch (err) {
        res.status(500).json(err)
    }
})

//get

router.get('/:conversationId' , async (req,res) => {
    try {
        const messages = await Message.find({
            conversationId : req.params.conversationId
        })
        res.status(200).json(messages)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;