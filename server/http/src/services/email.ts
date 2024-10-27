import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

dotenv.config()

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth :{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
})


const sendotp = async (email: string, otp: string) => {
   
    const mailOptions = {
        to: email,
        from: process.env.EMAIL,
        subject:"otp verification",
        text:`Your otp code is this ${otp} .It will expire in 10 mins`
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        await prisma.user.delete({
            where:{email: email}
        })
        console.error("Error during sending otp", error);
        
    }

}


const getotp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}


export { sendotp,  getotp }