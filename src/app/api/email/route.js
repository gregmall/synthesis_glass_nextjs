'use server'
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;

const transporter = nodemailer.createTransport({
    service:'outlook',
    host: SMTP_SERVER_HOST,
    port: 587,
    secure: false,
    auth: {
        user: SMTP_SERVER_USERNAME,
        pass: SMTP_SERVER_PASSWORD,
    },
});

transporter.verify((err, success)=>{
    if(err){
        console.log(err)
    }else{
        console.log('Ready for message')
    }
});
export const sendEmail = async (mail)=>{
console.log(mail.to)
    return await transporter.sendMail({
        from: SMTP_SERVER_USERNAME,
        to: mail.to,
        subject: mail.subject,
        html: mail.html,
        text: mail.text

    })


}