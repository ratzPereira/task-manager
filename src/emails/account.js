const sgMail = require('@sendgrid/mail')

const sendgridAPIKey= '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'

sgMail.setApiKey(sendgridAPIKey)


const sendWelcomeEmail = (email, name) => {
    
    sgMail.send({
        to: email,
        from: 'pereira.joaocl@gmail.com',
        subject: 'Thanks for joining us!',
        text: `Hello  ${name}  thanks for choosing us!`
    })
}

const sendCancellationEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: 'pereira.joaocl@gmail.com',
        subject: 'You successfully canceled your account',
        text: `Goodbye ${name}, we hope you comeback some day!`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
























/* sgMail.send({
    to: 'pereira.joaocl@gmail.com',
    from: 'pereira.joaocl@gmail.com',
    subject: 'This is my first creation',
    text: 'hope this works :D'
}).then(() => {}, error => {
    console.log(error)

    if (error.message) {
        console.error(error.response.body)
    }
}) */