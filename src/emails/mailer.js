/*
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey('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')
*/

/*
const acceptDoctorEmail = (name) => {
    sgMail.send({
        to: email,
        from: 'mohamedhussein8465@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Dear Doctor ${name}, Thank you for registering on our site. You have been accepted by the admin to be a member of our distinguished family of doctors. We have and we hope that you will be happy with us.  congratulations`
    })
}

const rejectDoctorEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mohamedhussein8465@gmail.com',
        subject: 'Thanks for your request!',
        text: `Dear Doctor ${name}, We are sorry for not accepting your request at the moment because we have enough doctors, so we are sorry and we promise to put him in another upcoming appointment.`
    })
}
*/


/*
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mohamedhussein8465@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const acceptDoctorEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: 'mohamedhussein8465@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Dear Doctor ${name}, Thank you for registering on our site. You have been accepted by the admin to be a member of our distinguished family of doctors. We have and we hope that you will be happy with us.  congratulations`
    })
}

const rejectDoctorEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mohamedhussein8465@gmail.com',
        subject: 'Thanks for your request!',
        text: `Dear Doctor ${name}, We are sorry for not accepting your request at the moment because we have enough doctors, so we are sorry and we promise to put him in another upcoming appointment.`
    })
}

const sendPasswordVerificationCode = (email, name, type, verificationCode)=>{
    sgMail.send({
        to: email,
        from: 'mohamedhussein8465@gmail.com',
        subject: 'Forget Password!',
        text: `Hello ${name}, ur verification code is  ${verificationCode}`
    })
}
*/
const nodemailer1 = require('nodemailer');
const transporter = nodemailer1.createTransport({
    service:'gmail',
    auth:{
        user:'mostafahasan0789@gmail.com',
        pass:'apathhivjbmuoiev'
    }
})

const sendWelcomeEmail = (email, name) => {
    const option = {
        to: email,
        from: 'mostafahasan0789@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    }
    transporter.sendMail(option , function(err,info){
        if(err){
            console.log('err = ',err)
        }
        else{
        console.log("sent : ",info)
        }
    })
}

const acceptDoctorEmail = (name, email) => {
    const option = {
        to: email,
        from: 'mostafahasan0789@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Dear Doctor ${name}, Thank you for registering on our site. You have been accepted by the admin to be a member of our distinguished family of doctors. We have and we hope that you will be happy with us.  congratulations`
    }
    transporter.sendMail(option , function(err,info){
        if(err){
            console.log('err = ',err)
        }
        else{
        console.log("sent : ",info)
        }
    })
}

const rejectDoctorEmail = (email, name) => {
    const option = {
        to: email,
        from: 'mostafahasan0789@gmail.com',
        subject: 'Thanks for your request!',
        text: `Dear Doctor ${name}, We are sorry for not accepting your request at the moment because we have enough doctors, so we are sorry and we promise to put him in another upcoming appointment.`
    }
    transporter.sendMail(option , function(err,info){
        if(err){
            console.log('err = ',err)
        }
        else{
        console.log("sent : ",info)
        }
    })
}

const sendPasswordVerificationCode = (email, name, type, verificationCode)=>{
    const option = {
        to: email,
        from: 'mostafahasan0789@gmail.com',
        subject: 'Forget Password!',
        text: `Hello ${name}, ur verification code is  ${verificationCode}`
    }
    transporter.sendMail(option , function(err,info){
        if(err){
            console.log('err = ',err)
        }
        else{
        console.log("sent : ",info)
        }
    })
}






module.exports = {
    sendWelcomeEmail,
    sendPasswordVerificationCode,
    acceptDoctorEmail,
    rejectDoctorEmail
}