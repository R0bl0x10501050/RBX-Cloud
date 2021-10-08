import Database from '../../../lib/Database.js';

export default async function handler(req, res) {
	let db = new Database();
	let { pkgName, id, user, key } = req.query;
	let key = await db.registerUser(user);
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({ key: key }));
}