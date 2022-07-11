const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
    try {
        const readmeIDFiles = core.getInput('readme-id-file', { required: true });
        const filterExpression = core.getInput('files-filer-expression', { required: true });
        const branchName = core.getInput('branch-name', { required: true });
        console.log('BRANCHNAME', branchName);
        console.log('FILTER_EXPRESSION', filterExpression);
        const octokit = new github.getOctokit(core.getInput('github-token', { required: true }));
        const { data } = await octokit.rest.repos.getContent({
            mediaType: { format: "raw" },
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            path: `${readmeIDFiles}`,
            ref: branchName
        });
        let readmeFiles = JSON.parse(data);
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