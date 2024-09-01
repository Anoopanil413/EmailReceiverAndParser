import nodemailer from 'nodemailer';
import { transporter } from '../config/email';

interface MailOptions {
    from: string | undefined;
    to: string;
    subject: string;
    text: string;
}

export const sendMail = (to: string, subject: string, text: string): void => {
    const mailOptions: MailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (err: Error | null, info: nodemailer.SentMessageInfo) => {
        if (err) {
            console.log('Error sending email:', err);
        } else {
            
            console.log('Email sent:', info.response);
        }
    });
};
