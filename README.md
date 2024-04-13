
![Logo](./logo.jpg)


# Markdown Driven Operations

Transform your development by replacing cluttered toolsets with a streamlined tool for managing project environments and task execution.

## What *mdops* Solves

Markdown Driven Operations streamlines project setup and management by eliminating the clutter of multiple tools. Here’s how:

- **No More Version Managers**: Forget SDKMAN, asdf, rbenv, pyenv, and nvm.
- **Simpler Build Tools**: Ditch complex scripts and Makefiles—use Markdown instead.
- **Everything in Markdown**: All project commands and dependencies are clearly documented and immediately discoverable.
- **Zero Installations**: Everything runs directly from the repo—no external installs needed.
- **Self-Contained Repos**: Clone and run projects with no additional setup.
- **Project Isolation**: Avoids version conflicts and keeps your system clean.
- **Clean System Environment**: Manage dependencies and versions locally within the project.
- **Efficient Setup**: Spend less time configuring and more time developing.

## :construction: Project Under Construction :construction:

This project is currently under active development. Before the first major release some functionalities might be incomplete,
and some features may not work as expected.


## Project Status

- The project is in its early stages. however some of the core features are already working as expected.
- I'm experimenting with some functionalities, so expect changes and possible breaking updates.
- Documentation and examples may be lacking or subject to frequent updates.


<!-- ## Demo -->

<!-- [TODO placeholder for youtube demo] -->


## Installation

One liner:

```shell
# cd to your project
sh <(curl -Ssf https://raw.githubusercontent.com/mdops-org/mdops-cli/main/mdops.sh) init
```

Thanks to [pkgx](https://pkgx.sh) we don't need to install anything beforehand. This will use the pkgx oneliner to download a temporary
Deno and use it to run our script over internet. Then the `init` subcommand will initialize the repo by updating the `README.md`
file to add places for dependencies and tasks. And creates a `scripts` folder and puts a minimal `mdops.ts` file there and uses
Deno to compile it to a binary. From now on you can use `scripts/mdops` from the root of your project to run tasks.


## Features

- A task runner based on the code in markdown file
- Automatic dependency installation in the background before running the tasks


## Documentation

<https://mdops.dev> [TBD]


## Usage/Examples

Put [mdops.sh](./mdops.sh) in your path

```shell
curl -o ~/.local/bin/mx https://raw.githubusercontent.com/mdops-org/mdops-cli/main/mdops.sh
chmod +x ~/.local/bin/mx
```

init your repo

```shell
cd my/cool/project
mx init
```

update your README.md to add dependency

```markdown
## Dependencies

| dependency | version |
|------------|---------|
| nodejs.org | 21.6.2  |

```

list your dependencies

```shell
mx dependencies list
```

add some tasks to your README.md

````markdown
## Tasks

### dev

run the dev server

```shell
npm run dev
```
````

list available tasks

``` shell
mx tasks list
```

and run a task with correct dependency versions

```shell
mx tasks run dev
```


## Get Involved

We welcome contributions and feedback! Here's how you can help:

- **Report Issues:** Encounter a bug or have a suggestion? Please create an issue to let us know.
- **Contribute:** Interested in contributing code, documentation, or tests? Check out our [TBD contributing guidelines](LINK_TO_CONTRIBUTING_GUIDELINES).
- **Join the Discussion:** Have questions or want to discuss ideas? Join our discussions in [GitHub Discussions](https://github.com/orgs/mdops-org/discussions) or our community chat on [TBD Discord/Slack](LINK_TO_CHAT).


## Roadmap

Check [TODO.org](./TODO.org) file.

## Run Locally

Clone the project

```bash
  git clone https://github.com/mdops-org/mdops-cli
```

Go to the project directory

```bash
  cd mdops-cli
```

Initialize the scripts folder

```bash
sh <(curl -Ssf https://pkgx.sh) deno run -A --unstable-ffi --unstable-fs ./main.ts init
```

List the tasks

```bash
scripts/mdops tasks list
```


## Tech Stack

**Runtime:** <https://deno.com/>

**Dependency management:** <https://pkgx.sh/>, <https://github.com/pkgxdev/libpkgx>

**Markdown parsing**: <https://unifiedjs.com/>


## FAQ

### Should I commit the mdops script and binary?

The normal usage of `mdops` is to create the script and binary once and it will never (or very rarely) change.
By commiting the script and the binary to your repo you will make it easily accessible to the other devs.

However, if you are concerned for the size of the repo or if you want to change the script frequently, you can
put the binary into `.gitignore` and add instructions for how to compile the script in the `README.md` file:

```shell
sh <(curl -Ssf https://pkgx.sh) deno@1.41.2 compile -A --unstable-ffi --unstable-fs -o scripts/ scripts/mdops.ts
```

This is a once step after cloning the repo.



## Dependencies

| dependency | version |
|------------|---------|
| deno.land  | 1.41.2  |


## Tasks

### recompile

```shell
scripts/mdops recompile
```


## Related

Here are some related projects. Thanks for the inspiration.

* [pkgx - a blazingly fast, standalone, cross‐platform binary that runs anything](https://pkgx.sh/)
* [xc - Simple, Convenient, Markdown-based task runner](https://github.com/joerdav/xc)
* [runme - DevOps Workflows Built with Markdown](https://runme.dev)

    
## License

[Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/)
