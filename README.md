# matrix-js-action

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

## How to build an js action

In the next links you can see how to build an action:

- [GitHub Actions](https://github.com/actions)
- [Creating a JS action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
- [How to Build Your First JavaScript GitHub Action](https://www.freecodecamp.org/news/build-your-first-javascript-github-action/)
