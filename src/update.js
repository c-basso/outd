const {exec} = require('./exec');

const update = async (cwd, libs, install) => {
    const libsToUpdate = libs.filter((lib) => !!lib.update);
    const updateCmd = `npm update ${libsToUpdate.map(({name}) => name).join(' ')}`;

    console.log(updateCmd);

    await exec({
        cmd: updateCmd,
        options: {
            cwd,
            maxBuffer: Infinity
        }
    });

    if (install) {
        const libsToInstall = libs.filter((lib) => !lib.update);
        const installCmd = `npm install ${libsToInstall.map(({name}) => `${name}@latest`).join(' ')}`;

        console.log(installCmd);

        await exec({
            cmd: installCmd,
            options: {
                cwd,
                maxBuffer: Infinity
            }
        });
    }
};

module.exports = {update};