import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter;

// Function to create or get the Nodemailer transporter
async function createTransporter() {
    if (transporter) {
        return transporter;
    }

    // If Ethereal placeholders are still present, create a test account
    if (process.env.EMAIL_SERVICE_USER === 'ETHEREAL_USER_PLACEHOLDER' || !process.env.EMAIL_SERVICE_USER) {
        let testAccount = await nodemailer.createTestAccount();
        console.log('Ethereal Test Account Created:');
        console.log('User:', testAccount.user);
        console.log('Pass:', testAccount.pass);
        console.log('You should add these to your server/.env file for EMAIL_SERVICE_USER and EMAIL_SERVICE_PASS.');
        console.log('Ethereal Mailtrap URL:', nodemailer.getTestMessageUrl(testAccount));

        transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    } else {
        // Use real credentials from .env
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVICE_HOST,
            port: process.env.EMAIL_SERVICE_PORT,
            secure: process.env.EMAIL_SERVICE_PORT == 465, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_SERVICE_USER,
                pass: process.env.EMAIL_SERVICE_PASS,
            },
        });
    }
    return transporter;
}


const sendEmail = async (to, subject, htmlContent) => {
    try {
        const currentTransporter = await createTransporter();

        // Get the from email (either from env or use a default)
        let fromEmail = process.env.EMAIL_SERVICE_USER || 'noreply@mentorchain.com';
        // If it's still the placeholder, we'll need to get it from the transporter or use a default
        if (fromEmail === 'ETHEREAL_USER_PLACEHOLDER') {
            fromEmail = 'noreply@mentorchain.com';
        }

        const mailOptions = {
            from: fromEmail, // Sender address
            to: to,                          // List of recipients
            subject: subject,                // Subject line
            html: htmlContent,               // HTML body
        };

        let info = await currentTransporter.sendMail(mailOptions);

        console.log('Message sent: %s', info.messageId);
        // Only log Ethereal URL if using test account
        if (process.env.EMAIL_SERVICE_USER === 'ETHEREAL_USER_PLACEHOLDER' || !process.env.EMAIL_SERVICE_USER) {
            console.warn('[ETHEREAL EMAIL SENT] Preview URL:', nodemailer.getTestMessageUrl(info));
        }
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email.');
    }
};

export default sendEmail;
