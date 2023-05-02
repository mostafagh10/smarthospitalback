
const router = require('express').Router();
const Feedback = require('../models/Feedback.model')

router.get('/', async (req, res) =>{
    try{
        const feedbacks = await Feedback.find({}).sort({createdAt: -1})
        res.status(200).send(feedbacks)
    }catch(error){
        res.status(500).send({ error: error.message })
    }
})
/*
router.get('/get/:id', async(req,res)=>{
    try {
        const feedback = await Feedback.findById(req.params.id)
        if(!feedback){
            return res.status(404).send()
        }
        res.status(200).send(feedback)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})
*/

router.get('/get/:id', async(req,res)=>{
    try {
        const feedback = await Feedback.find({userId:req.params.id}).sort({createdAt: -1})
        if(!feedback){
            return res.status(404).send()
        }
        res.status(200).send(feedback)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.post('/', async(req,res)=>{
    try {
        const feedback = new Feedback({...req.body})
        await feedback.save()
        res.status(200).send(feedback)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router