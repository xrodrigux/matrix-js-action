const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
    try {
        const readmeIDFiles = core.getInput('readme-id-file', { required: true });
        const filesToProcess = core.getInput('files-to-process', { required: true });
        const octokit = new github.getOctokit(core.getInput('github-token', { required: true }));
        const { data } = octokit.rest.repos.getContent({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            path: `${readmeIDFiles}`,
        });
        console.log("pdata: ", data);
        console.log('DIRNAME: ', __dirname);
        console.log(readmeIDFiles, filesToProcess);
        let readmeFiles = require(readmeIDFiles);
        let searchArray = filesToProcess.split(",");
        let toUpdate = readmeFiles.filter(f => searchArray.includes(f.file));
        console.log(toUpdate);
        core.setOutput('update-matrix', JSON.stringify(toUpdate));
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
};

// Call the main function to run the action
main();