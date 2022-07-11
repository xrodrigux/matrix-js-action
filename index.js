const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
    try {
        const readmeIDFiles = core.getInput('readme-id-file', { required: true });
        const filesToProcess = core.getInput('files-to-process', { required: true });
        let readmeFiles = require(readmeIDFiles);
        let searchArray = filesToProcess.split(",");
        let toUpdate = readmeFiles.filter(f => searchArray.includes(f.file));
        console.log(toUpdate);
        core.setOutput('update-matrix', JSON.stringify(toUpdate));
    } catch (error) {
        core.setFailed(error.message);
    }
};

// Call the main function to run the action
main();