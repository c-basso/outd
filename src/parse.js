const semver = require('semver');

const {exec} = require('./exec');
const {to} = require('./to');

const parse = async (cwd) => {
    const [error, outdated] = await to(
        exec({
            cmd: 'npm outdated --parseable',
            options: {
                cwd,
                maxBuffer: Infinity
            },
            silent: true
        })
    );

    if (error) {
        throw error;
    }

    return outdated
        .split('\n')
        .filter(Boolean)
        .map((line) => {
            const [, wantedF, currentF, latestF] = line.split(':');
            
            const [wanted] = wantedF.split('@').reverse();
            const [current] = currentF.split('@').reverse();
            const [latest] = latestF.split('@').reverse();
            
            const name = wantedF
                .split('@')
                .filter((i) => i !== wanted)
                .join('@');

            return {
                name,
                wanted,
                current,
                latest,
                update: semver.lt(current, wanted)
            };
        });
};

module.exports = {parse};
