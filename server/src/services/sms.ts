import twilio from 'twilio'

const sid = process.env.ACCOUNT_SID;
const authtoken = process.env.AUTH_TOKEN;

const client =  twilio(sid,authtoken)
const mine = "+918700629012"

const formatPhoneNumber = (phoneNumber: string): string => {

    let cleanedNumber = phoneNumber.replace(/\D/g, '');

    let final = "+91" + cleanedNumber;

    return final;
};

const sendotp = (phoneNumber: string, otp: string) => {

    const tosend = formatPhoneNumber(phoneNumber)
   
    client.messages.create({
        to: tosend,
        from: mine,
        body:`Your verification otp is ${otp}`
    })
    .then((message) => console.log(`Message sent: ${message.sid}`))
    .catch((error) => console.log(`Error occured during sending sms ${error}`))

}


const getotp = () => {
    return Math.floor(100000 + Math.random() * 900000);
}


export {getotp,sendotp}