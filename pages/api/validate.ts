import {firebaseAdmin as admin} from '../../firebase-admin';
import {NextApiRequest, NextApiResponse} from 'next';

interface UserData extends Object {
	// TODO: Make this interface identical to the firebase user document

}

interface ValidateResponse {
	user: {
		uid: string;
		email: string;
	};
	userData: UserData
}

const validate = async (token: string): Promise<ValidateResponse> => {
	const decodedToken = await admin.auth().verifyIdToken(token, true);
	console.log('Valid token.');

	// get user data from your DB store
	const data = (
		await admin
			.firestore()
			.doc(`/users/${decodedToken.uid}`)
			.get()
	).data() as UserData;

	const user = await admin.auth().getUser(decodedToken.uid);
	return {
		user: {
			uid: user.uid,
			email: user.email,
		},
		userData: data,
	};
};

const apiFunc = async (req: NextApiRequest, res: NextApiResponse ) => {
	try {
		const { token } = JSON.parse(req.headers.authorization || '{}');
		if (!token) {
			return res.status(403).send({
				errorCode: 403,
				message: 'Auth token missing.'
			});
		}
		const result = await validate(token);
		return res.status(200).send(result);
	} catch (err) {
		return res.status(err.code).send({
			errorCode: err.code,
			message: err.message,
		});
	}
}

export default apiFunc;
