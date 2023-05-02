const router = require("express").Router();
const Conversation = require("../models/conversation");


//new conversation
router.post('/', async (req,res) => {
    const newconversation = new Conversation({
        members : [req.body.senderId , req.body.receiverId]
    });

    try {
        const saveconversation = await newconversation.save();
        res.status(200).json(saveconversation)
    } catch (err) {
        res.status(500).json(err)
    }
})




//get conversation of a user
router.get('/:userId' , async(req,res) => {
    try {
        const conversation = await Conversation.find({
            members : {$in : [req.params.userId]}
        })

        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err)
    }
})


//get conv includes two userId
router.get('/find/:firstUserId/:secondUserId',async (req,res) => {
    try {
        const conversation = await Conversation.findOne({
            members : {$all : [req.params.firstUserId , req.params.secondUserId]}
        })
        if(conversation){
        res.status(200).json(conversation)
        }else{
            const newconversation = new Conversation({
                members : [req.params.firstUserId , req.params.secondUserId]
            });
        
            try {
                const saveconversation = await newconversation.save();
                res.status(200).json(saveconversation)
            } catch (err) {
                res.status(500).json(err)
            }
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;