![](http://fwsinternaladm.wpengine.com/wp-content/uploads/2021/09/fw-logo-small.png)


## Welcome

**@fws/cli** is work in progress and it's meant to work together with other Forwardslash tools.

**Please do not use it if you don't have access to other stuff.**

On second though, do feel free to explore it and mess around with it. :)

It's coffee time for us now... so, here's a pic of our Uncle :) 

![](http://fwsinternaladm.wpengine.com/wp-content/uploads/2020/11/fws.jpeg)

## Intro

[FWS CLI](https://www.npmjs.com/package/@fws/cli) is an internal tool used for automatization of routine development tasks.

It's usage is limited to and exclusive for Forwardslash projects, specifically project's built with FWS Starters:

- FWS Starter _S
- FWS Starter Nuxt
- FWS Starter Vue
- FWS Starter Twig

## Available Commands

As noted above, these commands are limited to FWS projects and with that in mind **most** of the commands are required to run from FWS project's directory.

### Default

Default commands available from any directory.

- Output the version number: 
    - `fws --version` or 
    - `fws -V`.
- Check for latest version:
    - `fws latest-version` or
    - `fws latest`.
- Display help for commands: 
    - `fws --help` or 
    - `fws -h`.

### General

General commands, available for all starters.

- Install node modules: 
    - `fws npm-i` or 
    - `fws i`.
- Create component files: 
    - `fws create-file <name> [options]` or 
    - `fws cf <name> [options]`.
- Optimizes and generates SVG icons: 
    - `fws icons`.
- Runs postinstall script: 
    - `fws postinstall`.
- Setup WP project using lando: 
    - `fws setup-wordpress` or 
    - `fws set-wp`.
- Validate pages via W3 API: 
    - `fws w3-validator <url> [options]` or 
    - `fws w3 <url> [options]`.
    
**Specific commands for each Starter can be found in each Starter's README.md file.**
