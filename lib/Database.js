// import JSONdb from 'simple-json-db';
import Request from './Request.js';
import { v4 as uuidv4 } from 'uuid';

// const db = new JSONdb('../public/packages.json');
const gh = new Request({ baseURL: 'https://api.github.com', token: process.env.GH_TOKEN });

let owner = "R0bl0x10501050";
let repo = "RBX-Cloud-Storage";
let ref = "heads/main";
let branch = "main";

let getData = async (nameOfFile) => {
	let branch = await gh.get(`/repos/${owner}/${repo}/git/ref/${ref}`);
	let commit = await gh.get(`/repos/${owner}/${repo}/git/commits/${branch.data.object.sha}`);
	let tree = await gh.get(`/repos/${owner}/${repo}/git/trees/${commit.data.tree.sha}`);
	let final;

	await tree.data.tree.forEach(async (obj) => {
		if (final) { return; }
		if (obj.path == nameOfFile + ".json") {
			let blob = await gh.get(`/repos/${owner}/${repo}/git/blobs/${obj.sha}`);
			final = atob(blob.data.content || "");
			try {
				final = JSON.parse(final);
			} catch (e) {}
		}
	});

	return final;
}

let postData = async (nameOfFile, newData) => {
	let appliedChanges = [
		{
			path: nameOfFile + "Database.json",
			type: "blob",
			mode: "100644",
			content: newData
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

export class Database {
	async addPackage(pkgName, id, user, key) {
		let owner = (await getData("Owners")) || {};
		if (owner[user] == key) {
			let data = (await getData("Database")) || {};
			data[pkgName] = id;
			await postData("Database", data);
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