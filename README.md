
![Logo](./logo.jpg)


# Markdown Driven Operations

A simple tool to manage dependeny version management and task running for your projects.


## Demo

[TODO placeholder for youtube demo]


## Installation

One liner:

```shell
# cd to your project
sh <(curl -Ssf https://pkgx.sh) deno@1.41.2 run -A --unstable-ffi --unstable-fs https://raw.githubusercontent.com/mdops-org/mdops-cli/main/main.ts init
```

Thanks to [pkgx](https://pkgx.sh) we don't need to install anything beforehand. This will use the pkgx oneliner to download a temporary
Deno and use it to run our script over internet. Then the `init` subcommand will initialize the repo by updating the `README.md`
file to add places for dependencies and tasks. And creates a `scripts` folder and puts a minimal `mdops.ts` file there and uses
Deno to compile it to a binary. From now on you can use `scripts/mdops` from the root of your project to run tasks.


## Features

- Light/dark mode toggle
![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)
- Live previews
![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)
- Fullscreen mode
![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)
- Cross platform
![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)


## Documentation

[TODO link to documentation website]


## Usage/Examples

[TODO add usage]

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

``` shell
sh <(curl -Ssf https://pkgx.sh) deno@1.41.2 compile -A --unstable-ffi --unstable-fs -o scripts/ scripts/mdops.ts
```

This is a once step after cloning the repo.



## Dependencies

| dependency | version |
|------------|---------|
| deno.land  | 1.41.2  |


## Tasks

### recompile

``` shell
scripts/mdops recompile
```


## Related

Here are some related projects. Thanks for the inspiration.

* [pkgx: Run anything binary](https://pkgx.sh/)
* [XC: Markdown defined task runner](https://github.com/joerdav/xc)

    
## License

[MIT](https://choosealicense.com/licenses/mit/)
