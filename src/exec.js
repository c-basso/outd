const cp = require('child_process');

const exec = (params) => new Promise((resolve, reject) => {
	const {cmd, options, silent} = params;

	cp.exec(cmd, options, (error, stdout = '') => {
		if (silent && error && !stdout) {
			reject(error);
			return;
		}

		if (!silent && error) {
			reject(error);
			return;
		}

		resolve(stdout.toString().trim());
		return;
	});
});

module.exports = {exec};
