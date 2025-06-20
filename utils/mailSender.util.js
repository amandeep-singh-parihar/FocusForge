import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const mailSender = async (email, title, body) => {
	try {
		let transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		});

		let info = await transporter.sendMail({
			from: 'Amandeep Singh Parihar',
			to: `${email}`,
			subject: `${title}`,
			html: `${body}`,
		});

		console.log('Email sent: ', info.response);
		return info;
	} catch (error) {
		console.log('Error while sending email:', error);
		throw error;
	}
};

export default mailSender;
