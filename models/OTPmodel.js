import mongoose from 'mongoose';
import mailSender from '../utils/mailSender.util.js';

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60, // OTP expires in 5 minutes (300 seconds)
    },
});

// Function to send verification OTP email
async function sendVerificationOTP(email, otp) {
    try {
        // Directly construct the HTML body for the email
        const emailBody = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                    .container { background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto; }
                    h2 { color: #333333; }
                    p { color: #666666; line-height: 1.6; }
                    .otp-code { font-size: 24px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0; padding: 10px; border: 1px dashed #007bff; border-radius: 4px; }
                    .footer { font-size: 12px; color: #999999; text-align: center; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Email Verification - Your OTP</h2>
                    <p>Dear User,</p>
                    <p>Thank you for registering with StudyNotion. To complete your registration, please use the following One-Time Password (OTP):</p>
                    <div class="otp-code">${otp}</div>
                    <p>This OTP is valid for 5 minutes. Please do not share this OTP with anyone.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>Thanks,</p>
                    <p>The StudyNotion Team</p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} StudyNotion. All rights reserved.
                </div>
            </body>
            </html>
        `;

        const mailResponse = await mailSender(
            email,
            'StudyNotion - Verification OTP', // A more descriptive subject
            emailBody, // Use the constructed emailBody directly
        );
        console.log('Email sent Successfully: ', mailResponse.response);
    } catch (error) {
        console.log('error occurred while sending emails: ', error);
        throw error;
    }
}

OTPSchema.pre('save', async function (next) {
    // Only send an email when a new document is being created
    // and `isNew` property is true.
    // This prevents sending OTP again if the document is merely updated.
    if (this.isNew) {
        console.log('Sending verification OTP to:', this.email);
        await sendVerificationOTP(this.email, this.otp);
    }
    next();
});

export default mongoose.model('OTP', OTPSchema);