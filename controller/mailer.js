import nodemailer from 'nodemailer';
import Mailgen from 'mailgen'
import ENV from '../config.js'
// let testAccount = await nodemailer.createTestAccount();


export const registerMail = async (req, res) => {
  const { userName, email, text, subject } = req.body;


  let config = {
    // // service: 'gmail',
    // auth: {
    //   user: ENV.EMAIL, // generated ethereal user
    //   pass: ENV.PASS, // generated ethereal password
    // },
  }

  let transporter = nodemailer.createTransport(config);


  let mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'Auth App',
      link: 'https://mailgen.js/'
    }
  });

  var makeEmail = {
    body: {
      name: userName,
      intro: text || 'Welcome to my protfolio ! i am very excited to have you on board.',
      // action: {
      //   instructions: 'To get started with Mailgen, please click here:',
      //   button: {
      //     color: '#22BC66', // Optional action button color
      //     text: 'Confirm your account',
      //     link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
      //   }
      // },
      outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
  }
  var emailBody = mailGenerator.generate(makeEmail);


  let message = {
    from: ENV.EMAIL, // sender address
    to: email, // list of receivers
    subject: subject || "Register Successful", // Subject line
    text: text || "Hello world?", // plain text body
    html: emailBody, // html body
  }

 transporter.sendMail(message).then(()=>{
  return res.status(201).json({msg:"success"})
 }).catch(err=>{
  return res.status(500).json({err})
 });
  


};
