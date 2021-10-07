import axios from 'axios';

class Request {
	constructor(options) {
		this.baseURL = options.baseURL;
		this.token = options.token;
	}

	async _send(config, headers) {
		for (const [k, v] of Object.entries(headers || {})) {
			if (k == 'Authorization') { continue; }
			config.headers[k] = v;
		}

		let response = await axios(config);
		return response;
	}
	
	async get(url, headers) {
		const config = {
			method: 'get',
			url: this.baseURL + url,
			headers: {
				'Authorization': 'token ' + this.token,
				'Content-Type': 'application/json'
			}
		};

		let res = await this._send(config, headers);
		return res || null;
	}

	async post(url, data, headers) {
		const config = {
			method: 'post',
			url: this.baseURL + url,
			headers: {
				'Authorization': 'token ' + this.token,
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(data)
		};

		let res = await this._send(config, headers);
		return res || null;
	}

	async patch(url, data, headers) {
		const config = {
			method: 'patch',
			url: this.baseURL + url,
			headers: {
				'Authorization': 'token ' + this.token,
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(data)
		};

		let res = await this._send(config, headers);
		return res || null;
	}
}

export default Request;