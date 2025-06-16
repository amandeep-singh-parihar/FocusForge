import { connect } from 'mongoose';
import 'dotenv/config';
export const DBconnect = async () => {
	try {
		await connect(process.env.DATABASE_URL);
		console.log('DB connection successful');
	} catch (err) {
		console.error(err);
		console.log('Error while connecting to the database');
		process.exit(1);
	}
};
