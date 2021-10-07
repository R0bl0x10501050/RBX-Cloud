// import JSONdb from 'simple-json-db';
import Request from './Request.js';
import { v4 as uuidv4 } from 'uuid';

// const db = new JSONdb('../public/packages.json');
const gh = new Request({ baseURL: 'https://api.github.com', token: process.env.GH_TOKEN });

let owner = "R0bl0x10501050";
let repo = "RBX-Cloud-Storage";
let ref = "heads/main";
let branch = "main";

// https://gist.github.com/oeon/0ada0457194ebf70ec2428900ba76255
let a2b = (a) => {
	var b, c, d, e = {}, f = 0, g = 0, h = "", i = String.fromCharCode, j = a.length;
	for (b = 0; 64 > b; b++) e["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(b)] = b;
	for (c = 0; j > c; c++) for (b = e[a.charAt(c)], f = (f << 6) + b, g += 6; g >= 8;) ((d = 255 & f >>> (g -= 8)) || j - 2 > c) && (h += i(d));
	return h;
}

let getData = async (nameOfFile) => {
	let branch = await gh.get(`/repos/${owner}/${repo}/git/ref/${ref}`);
	let commit = await gh.get(`/repos/${owner}/${repo}/git/commits/${branch.data.object.sha}`);
	let tree = await gh.get(`/repos/${owner}/${repo}/git/trees/${commit.data.tree.sha}`);

	for (let i = 0; i < tree.data.tree.length; i++) {
		let obj = tree.data.tree[i];
		if (obj.path == nameOfFile + ".json") {
			let blob = await gh.get(`/repos/${owner}/${repo}/git/blobs/${obj.sha}`);
			let final = Buffer.from(blob.data.content || "", 'base64').toString('utf-8'); /* a2b(blob.data.content || ""); */
			try {
				let x = JSON.parse(final);
				final = x;
			} catch (e) { } finally {
				return final;
			}
		}
	}

	return {};
}

let postData = async (nameOfFile, newData) => {
	let appliedChanges = [
		{
			path: nameOfFile + ".json",
			type: "blob",
			mode: "100644",
			content: JSON.stringify(newData)
		}
	];

	let main_ref = await gh.get(
		`/repos/${owner}/${repo}/git/ref/heads/${branch}`,
	)
	let old_commit_sha = main_ref.data.object.sha;

	let newTree = await gh.post(
		`/repos/${owner}/${repo}/git/trees`,
		{
			tree: appliedChanges,
			base_tree: old_commit_sha
		}
	)
	let new_tree_sha = newTree.data.sha;

	let newCommit = await gh.post(
		`/repos/${owner}/${repo}/git/commits`,
		{
			message: message,
			tree: new_tree_sha,
			parents: [
				old_commit_sha
			]
		}
	)

	let new_commit_sha = newCommit.data.sha;

	let newRef = await gh.post(
		`/repos/${owner}/${repo}/git/refs/heads/${branch}`,
		{
			sha: new_commit_sha
		}
	)

	let new_ref_sha = newRef.data.object.sha;

	return new_ref_sha;
}

export default class Database {
	constructor() { }
	
	async addPackage(pkgName, id, user, key) {
		let owner = (await getData("Owners")) || {};
		if (owner[user] == key) {
			let data = (await getData("Database")) || {};
			data[pkgName] = id;
			await postData("Database", data);
		} else {
			console.log(JSON.stringify(owner));
			console.log(user);
			console.log(key);
			console.log("Incorrect credentials!");
		}
	}

	async getPackage(pkgName) {
		let data = (await getData("Database")) || {};
		return data[pkgName] || {};
	}

	async registerUser(user) {
		let data = (await getData("Owners")) || {};
		if (data[user.toString()]) { return; }
		data[user.toString()] = uuidv4();
		await postData("Owners", data);
		return data[user];
	}
}