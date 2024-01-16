// emailController.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const logoPath = './logo-no-word.png'
const logoData = fs.readFileSync(logoPath);


const sendResetToken = (token, email) =>{

    const transporter = nodemailer.createTransport({
        host:require('dotenv').config().parsed.host,
        port:require('dotenv').config().parsed.port,
        secure: false,
        auth: {
            user: require('dotenv').config().parsed.mailingUser,
            pass: require('dotenv').config().parsed.mailingPass
        }
    });

    const mailOptions = {
      from: "noreply@hollywoodsq.com",
      to: email,
      subject: 'Reset Password',
      text: `This is a system-generated email.`, // Plain text version
      html: `
        <head>
            <style>
            .main-container{
            background-color: #F3F3F3;
            }
            img {
            max-width: 70%;
            height: auto;
            }
            span {
            font-family: 'Arial', sans-serif;
            color: #333;
            }
            .token-container {
            background-color: #F3F3F3;
            padding: 10px;
            }
            .logo-container{
            background-color: #F3F3F3;
            }
            strong {
            color: black;
            }
        </style>
      </head>

      <body>
          <div class='logo-container container border'>
            <img class="border" src="cid:logo" alt="Logo">
          <hr>
          <span>Your reset token is:</span>
          <div class="token-container">
            <span>
               <strong>${token}</strong>
            </span>
          </div>
          <hr>
          
            <span>This is a system-generated email.</span>
          </div>
      </body>
    `,
        attachments: [
            {
                filename: 'logo.png',
                content: logoData,
                cid: 'logo',
            },
        ],// HTML version
      };
    
    const send = transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return({false:error});
        }else{
            return(`Email sent: ${info.response}`);
        }
    
            
    });
}

module.exports.generateResetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user with the provided email exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Generate reset token
        const resetToken = jwt.sign({ email }, dotenv.parsed.sessionSecret, { expiresIn: '5m' });

        // Store reset token in session (for demonstration purposes, you might want to store it in a more secure way)
        

        // Send the reset token to the user's email (you can use Nodemailer here as well)
        sendResetToken(resetToken, email);
        res.status(200).send('Reset token sent. Check your email.');
    } catch (error) {
        console.error('Error generating reset token:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports.verifyResetPasswordToken = async(req,res) =>{
    const { token } = req.body;

  try {
    // Verify the token against the secret key
    const decoded = jwt.verify(token, dotenv.parsed.sessionSecret);

    req.session.resetToken = token;

    res.status(200).send(true);
    
    
  } catch (err) {
    res.status(400).send('Invalid or expired token.');
  }
}

module.exports.resetPassword = async(req, res) =>{
    try {
        const { newPassword } = req.body;


        const decoded = jwt.verify(req.session.resetToken, dotenv.parsed.sessionSecret);
        
        const user = await User.findOne({ email: decoded.email }); // Find user by email

        if (!user) {
            return res.status(400).send('Invalid or expired token.');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });
        delete req.session.resetToken;
        // Sending a success response
        return res.status(200).send({ message: 'Password updated successfully' });
        
      } catch (error) {
        console.error(error);
        delete req.session.resetToken;
        return res.status(500).send({ message: 'Internal server error' });
        
      }
}
