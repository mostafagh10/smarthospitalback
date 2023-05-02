const express = require('express')
const cors = require('cors')
const app = express()
require('./src/DB/connection')

app.use(express.json())

const URL = process.env.FE_URL || "http://localhost:3000"

app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', true);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
})

// Routers
const adminRouter = require('./src/routers/Admin.router')
const doctorRouter = require('./src/routers/Doctor.router')
const patientRouter = require('./src/routers/patient1.router')
const hospitalRouter = require('./src/routers/Hospital.router')
const medicineRouter = require('./src/routers/Medicine.router')
const pharmacyRouter = require('./src/routers/Pharmacy.router')
const specializationRouter = require('./src/routers/Specialization.router')
const diseaseRouter = require('./src/routers/Disease.router')
const feedbackRouter = require('./src/routers/feedback.router')
const conversationRoute = require("./src/routers/conversation")
const messageRoute = require("./src/routers/message")


app.use('/user/admin', adminRouter)
app.use('/user/doctor', doctorRouter)
app.use('/user/patient', patientRouter)
app.use('/hospital', hospitalRouter)
app.use('/medicine', medicineRouter)
app.use('/pharmacy', pharmacyRouter)
app.use('/specialization', specializationRouter)
app.use('/disease', diseaseRouter)
app.use('/feedback', feedbackRouter)
app.use("/conversations", conversationRoute);
app.use("/messages", messageRoute);

app.use((req, res)=>{
    res.status(400).send()
})


const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`server is up on port ${PORT}`))