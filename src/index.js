const prompts = require('prompts');
const {parse} = require('./parse');
const {update} = require('./update');

const argv = process.argv.slice(2);

const UPDATE_ALL_DEPS_FLAG = '--all';
const SKIP_MANUAL_CHECK_FLAG = '--yes';

const updateAll = argv.includes(UPDATE_ALL_DEPS_FLAG);
const skipCheck = argv.includes(SKIP_MANUAL_CHECK_FLAG);

(async () => {
    const cwd = process.cwd();
    const libs = await parse(cwd);

    if (!libs.length) {
        console.log('Nothing to update!');
        return;
    }

    if (skipCheck) {
        await update(cwd, libs, updateAll);
        return;
    }

    const libsToCheck = updateAll ? libs : libs.filter(({update}) => update);

    if (!libsToCheck.length) {
        console.log('Nothing to update!');
        return;
    }

    const promptParams = libsToCheck.map(({name, wanted, current, latest, update}) => ({
        name,
        message: `Update package ${name} from ${current} to ${update ? wanted : latest }?`,
        type: 'select',
        choices: [
            {
                title: 'Yes',
                value: true
            },
            {
                title: 'No',
                value: false
            }
        ],
        initial: 0,
        required: true
    }));

    const response = await prompts(promptParams);

    const filteredLibs = libsToCheck
        .filter(({name}) => !!response[name]);

    if (!filteredLibs.length) {
        console.log('Nothing to update!');
        return;
    }

    await update(cwd, filteredLibs, updateAll);
})();
