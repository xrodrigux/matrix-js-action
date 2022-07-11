const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
    try {
        const readmeIDFiles = core.getInput('readme-id-file', { required: true });
        const filesToProcess = core.getInput('files-to-process', { required: true });
        const octokit = new github.getOctokit(core.getInput('github-token', { required: true }));
        console.log('READMEIDFILES = ', readmeIDFiles);
        console.log('FILESTOPROCESS = ', filesToProcess);
        // name is data because it's taken from response body 
        const { data } = await octokit.rest.repos.getContent({
            mediaType: { format: "raw" },
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            path: `${readmeIDFiles}`
        });
        console.log('DATA ', data);
        let readmeFiles = JSON.parse(data);
        let searchArray = filesToProcess.split(",");
        let toUpdate = readmeFiles.filter(f => searchArray.includes(f.file));
        console.log('update-matrix', toUpdate);
        core.setOutput('update-matrix', toUpdate);
        core.setOutput('has-updates-to-process', (toUpdate.length > 0 ? 1 : 0));
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
};

// Call the main function to run the action
main();