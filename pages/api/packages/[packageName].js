import Database from '../../../lib/Database.js';

export default async function handler(req, res) {
	let db = new Database();
	let { pkgName } = req.query;
	let id = await db.getPackage(pkgName);
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({ pkgId: id }));
}