# Readme action Matrix

To automate the uploading of several spec files to readme site, in a github workflow, you need to use a matrix that will call the readmeio/rdme@7.3.0 action on each spec file. This action helps you with this task.

## How to compile this action

After downloading this repository run the following command:  ```npm install```

Once installed the code of the action is in index.js file. To compile the action run the following command  ```ncc build index.js -o dist```. This will create a compiled version of the action in the dist folder.

## How to use this action in a workflow

In order to update a REST API file to [readme.com](https://readme.com/) site, using [readmeio/rdme@vXX](https://www.npmjs.com/package/rdme) in a workflow action, you need an API ID. When you have several API IDs, that may become a problem.

This script will take an input file withe the next format:

```json
[
    { "id": "1", "file": "API 1" },
    { "id": "2", "file": "API 2" },
    { "id": "3", "file": "API 3" }
]
```

Will filter that array using the files names of updated APIs and will return a matrix with the following format:

```json
[
    { "ID" : "1", "file" : "API 1" },
    { "ID" : "3", "file" : "API 3" }
]
```

It will only return the changed APIs.

To use this action you need to configure a workflow in your repository. Next is an example workflow:

```YAML
# For info on getting the latest rdme version and obtaining your API_DEFINITION_ID,
# see our docs: https://docs.readme.com/docs/rdme#example-syncing-an-openapi-definition
name: Sync OAS to ReadMe
on:
  push:
    branches:
      - main
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:
jobs:
  get_changed_files:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest
    outputs:
      changed_yaml_files: ${{ steps.changed_files.outputs.yaml_files }}
      has_changed_files: ${{ steps.changed_files.outputs.yaml_changed }}
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v3
        with:
          # Checkout as many commits as needed for the diff
          fetch-depth: 2
      - name: Changed files
        id: changed_files
        run: |
          git_diff=$(git diff --name-only HEAD^ HEAD | grep '^spec/API/.*\.yaml$' | sed -n -e 'H;${x;s/\n/,/g;s/^,//;p;}')
          count=$(echo $git_diff | wc -c)
          if [[ $count -gt 2 ]]
          then
            HAS_YAML_FILES=1
          else 
            HAS_YAML_FILES=0
          fi
          echo "changed_files: ${git_diff}"
          echo "::set-output name=yaml_files::$git_diff"
          echo "::set-output name=yaml_changed::$HAS_YAML_FILES"
  changed_apis_to_matrix:
    needs: [get_changed_files]
    runs-on: ubuntu-latest
    name: Check changed files and create matrix for readme
    if: needs.get_changed_files.outputs.has_changed_files == 1
    outputs:
      update-matrix: ${{ steps.generate_matrix_step.outputs.update-matrix }}
    steps:
      - name: Generate matrix
        id: generate_matrix_step
        uses: xrodrigux/matrix-js-action@main
        with:
          readme-id-file: "spec/readme.io.files.json"
          files-to-process: ${{ needs.get_changed_files.outputs.changed_yaml_files }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
  publish_readmeio:
    needs: [changed_apis_to_matrix]
    runs-on: ubuntu-latest
    strategy:
      max-parallel: 10
      matrix:
        value: ${{ fromJSON(needs.changed_apis_to_matrix.outputs.update-matrix) }}
    steps:
      - uses: actions/checkout@v3
      - uses: readmeio/rdme@7.3.0
        with:
          rdme: openapi ${{ matrix.value.file }} --key=${{ secrets.README_API_KEY }} --id=${{ matrix.value.id }}
      - run: |
          echo ${{ matrix.value.id }} ${{ matrix.value.file }}
```

## How to build an js action

In the next links you can see how to build an action:

- [GitHub Actions](https://github.com/actions)
- [Creating a JS action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
- [How to Build Your First JavaScript GitHub Action](https://www.freecodecamp.org/news/build-your-first-javascript-github-action/)
