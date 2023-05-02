
const router = require('express').Router()
const Doctor = require('../models/Doctor.model')
const authDoctor = require('../middleware/authDoctor')
const authAdmin = require('../middleware/authAdmin')
const { sendPasswordVerificationCode, acceptDoctorEmail, rejectDoctorEmail } = require('../emails/mailer')
const { generateToken } = require('../Utils/Helpers')


// to get all doctors 
router.get('/', /* authAdmin, */ async (req, res) => {
  try {
    const doctors = await Doctor.find({status:true})
    res.status(200).send(doctors)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to get all requests
router.get('/request', /* authAdmin, */ async (req, res) => {
  try {
    const doctors = await Doctor.find({status:false})
    res.status(200).send(doctors)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to get an doctor 
router.post('/me', authDoctor, async (req, res) => {
  try {
    res.status(200).send(req.doctor)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to get an doctor 
router.get('/get/:id', async (req, res) => {
  const id = req.params.id
  try {
    const doctor = await Doctor.findById(id)
    if(!doctor){
      res.status(404).send("doctor not found")
    }
    res.status(200).send(doctor)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to get an doctor by name/specialization
router.get('/find', async (req, res) => {
  let searchBy = {}
  if (req.query.name) {
    searchBy.name = req.query.name
  }
  if (req.query.specialization) {
    searchBy.specialization = req.query.specialization
  }
  try {
    const doctor = await Doctor.find({ ...searchBy })
    if (!doctor) {
      res.status(404).send("doctor not found")
    }
    res.status(200).send(doctor)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.get('/get-pending', authAdmin, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: false })
    res.status(200).send(doctors)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

/*
router.get('/activate-status/:id', authAdmin, async (req, res) => {
  const id = req.params.id
  try {
    const doctor = await Doctor.update({ _id: id }, { status: true })
    acceptDoctorEmail(doctor.name)
    res.status(200).send(doctor)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})
*/

router.get('/activate-status/:id', /* authAdmin, */ async (req, res) => {
  const id = req.params.id
  try {
    // const doctor = await Doctor.update({ _id: id }, { status: true }, { new: true })
    const doc = await Doctor.findById(id)
    doc.status = true
    acceptDoctorEmail(doc.name, doc.email)
    await doc.save()
    res.status(200).send(doctor)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to reject doctor
/*
router.delete('/reject/:id', authAdmin, async (req, res) => {
  const id = req.params.id
  try {
    const doctor = await Doctor.findById(id)
    if (!doctor) {
      res.status(404).send("not found doctor")
    }
    rejectDoctorEmail(doctor.email, doctor.name)
    await doctor.remove()
    res.status(200).send()
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})
*/

// to reject doctor
router.delete('/reject/:id',/* authAdmin, */async (req, res) => {
  const id = req.params.id
  try {
    const doctor = await Doctor.findById(id)
    if (!doctor) {
      res.status(404).send("not found doctor")
    }
    rejectDoctorEmail(doctor.email, doctor.name)
    await doctor.remove()
    res.status(200).send()
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to add a new doctor 
router.post('/signup', async (req, res) => {
  try {
    const exist = await Doctor.findOne({ email: req.body.email })

    if (exist) {
      return res.status(400).json({
        error: 'this email already exists'
      })
    }
    const doctor = new Doctor({ ...req.body/* , status: false */ })
    const token = await doctor.generateAuthToken()
    res.status(200).send({ doctor, token })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to login as an doctor
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const doctor = await Doctor.findByCredentials(email, password)
    doctor.lastLogin = new Date()
    const token = await doctor.generateAuthToken()

    res.status(200).send({ doctor, token })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to edit an doctor 
router.patch('/:id',/* authDoctor, */ async (req, res) => {
  /*
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'gender', 'pictureUrl', 'address', 'city', 'phoneNumber', 'dateOfBirth', 'clinicAddress', 'clinicName', 'clinicPhone', 'workHours', 'rate', 'specialization']
  const isAllowed = updates.every(update => allowedUpdates.includes(update))
  if (!isAllowed) {
    throw new Error()
  }
  try {
    updates.forEach(update => req.doctor[update] = req.body[update])
    await req.doctor.save()
    res.status(200).send(req.doctor)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
  */

  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'gender', 'pictureUrl', 'address', 'phoneNumber', 'clinicAddress', 'clinicName', 'workHours', 'rate', 'specialization']
  const isAllowed = updates.every(update => allowedUpdates.includes(update))
  if (!isAllowed) {
    return res.status(404).send()
  }
  try {
    const doctor = await Doctor.findOne({ _id })
    if (!doctor) {
      return res.status(404).send()
    }
    updates.forEach(update => doctor[update] = req.body[update])
    await doctor.save()
    res.status(200).send(doctor)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to delete an doctor 
router.delete('/:id', /* authDoctor, */ async (req, res) => {
  const { id } = req.params
  try {
    //await req.doctor.remove()
    await Doctor.findByIdAndDelete(id)
    res.status(200).send()
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to logout from a device
router.post('/logout', authDoctor, async (req, res) => {
  try {
    req.doctor.tokens = req.doctor.tokens.filter(token => req.token !== token.token)
    await req.doctor.save()
    res.status(200).send({ msg: "the doctor logged out" })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// to logout from all devices
router.post('/logout-all', authDoctor, async (req, res) => {
  try {
    req.doctor.tokens = []
    await req.doctor.save()
    res.status(200).send()
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})


router.post('/password/forget', async (req, res) => {
  /*
  const email = req.body
  const doctor = await Doctor.findOne({ email })
  if (!doctor) {
    res.status(400).send("not find doctor")
  }
  if (doctor.verificationCode) {
    sendPasswordVerificationCode(doctor.email, doctor.name, doctor.verificationCode, 'doctor')
  } else {
    const code = await generateToken()
    doctor.passwordResetToken = code
    sendPasswordVerificationCode(doctor.email, doctor.name, code)
    await doctor.save()
    */
    const doctor = await Doctor.findOne({ email: req.body.email })
    if (!doctor){
      return res.status(404).send("doctor is not found")
    }
    if (doctor.verificationCode) {
      sendPasswordVerificationCode(doctor.email, doctor.name, 'doctor', doctor.verificationCode)
    } else {
    doctor.verificationCode= await generateToken(4)
    sendPasswordVerificationCode(doctor.email, doctor.name, 'doctor', doctor.verificationCode )
    await doctor.save()
  }
  res.status(200).send()
})

router.post('/password/code/verification', async (req, res) => {
  /*
  const code = req.params.code
  if (!code) {
    res.status(400).send("code error")
  }
  const doctor = await Doctor.findOne({ passwordResetToken: code })
  if (!doctor) {
    res.status(400).send("not find doctor")
  }
  doctor.changePassword = true
  doctor.passwordResetToken = undefined
  await doctor.save()
  res.status(200).send()
  */
  const { verificationCode, email } = req.body
  try {
    const doctor = await Doctor.findOne({ email })
    if (!doctor) {
      return res.status(400).send("not find a doctor")
    }
    if(verificationCode!== doctor.verificationCode){
      return res.status(400).send("code is not valid")
    }
    doctor.changePassword = true
    doctor.verificationCode = undefined
    await doctor.save()
    res.status(200).send()
  } catch (error) {
    res.status(500).send()
  }
})

// should send email, pass, confirm pass
router.post('/password/reset', async (req, res) => {
  const { email, password, confirmPassword } = req.body
  console.log(email, password, confirmPassword);
  const doctor = await Doctor.findOne({ email })
  if (!doctor) {
    res.status(400).send("not find a doctor")
  }
  if (!doctor.changePassword) {
    res.status(400).send("forget req first")
  }
  if (password !== confirmPassword) {
    res.status(400).send("not matched")
  }
  doctor.password = password
  doctor.changePassword = false
  await doctor.save()
  res.status(200).send()
})

// the rate post

router.post('/rate/:id', async (req,res) => {
  const _id = req.params.id
  try {
  const { rater , therate } = req.body;
  const doctor = await Doctor.findById({ _id })
  doctor.rate.unshift({rater , therate})
  console.log(rater , therate)
  await doctor.save();
  res.status(200).json(doctor.rate)
  } catch (err) {
    res.status(500).json(err)
  }
})

//the rate get
router.get('/rate/:firstid/:secondid', async (req,res) => {
  const _id = req.params.firstid
  const _id2 = req.params.secondid
  try {
  const getrate = await Doctor.find({_id : _id , 'rate.rater' : {$in : _id2} })
  
  if(getrate){
    res.status(200).json(getrate)
  }
  } catch (err) {
    res.status(400).json(err)
  }
})



module.exports = router