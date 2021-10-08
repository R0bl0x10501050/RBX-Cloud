import Database from '../../../lib/Database.js';

export default async function handler(req, res) {
	let db = new Database();
	let { pkgName, id, user, key } = req.query;
	let success = await db.addPackage(pkgName, id, user, key);
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({ success: success }));
}