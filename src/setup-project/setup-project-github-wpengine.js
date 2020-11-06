/**
 * Create Github Pipeline
 *
 * @description CLI script for creating .github config for WPEngine pipeline.
 */
const fs = require('fs');
const path = require('path');
const helpers = require('../helpers');
const store = require('../store');

module.exports = {
    themeName: '',
    devSlug: '',
    githubDir: path.join(process.cwd(), '/.github/workflows/dev-deployment.yml'),
    deployGitIgnore: path.join(process.cwd(), 'deploy.gitignore'),

    init: function(devName) {
        this.themeName = store.getters.getWpThemeName();
        this.devSlug = devName.replace('.wpengine.com', '');

        return {
            githubConfig: this.createGithubConfig(),
            deployGitIgnore: this.createDeployGitIgnore()
        }
    },

    createGithubConfig: function() {
        // exit if .github already exists
        if (fs.existsSync(this.githubDir)) {
            return null;
        }

        // create github config directories
        helpers.createNestedDirectories(['.github', 'workflows']);

        // compile template
        const githubPipelineJobs = fs.readFileSync(path.join(helpers.moduleDir, 'templates', 'temp-github-wpengine-jobs.txt'), 'utf8');
        const data = {
            themeName: this.themeName,
            devSlug: this.devSlug,
            jobs: githubPipelineJobs
        };
        const tempFile = 'temp-github-wpengine.txt';
        const compiledTemplate = helpers.compileTemplate(tempFile, data);

        // create file
        fs.writeFileSync(this.githubDir, compiledTemplate, 'utf8');

        return true;
    },

    createDeployGitIgnore: function() {
        // exit if deploy.gitignore already exists
        if (fs.existsSync(this.deployGitIgnore)) {
            return null;
        }

        const gitIgnore = fs.readFileSync(path.join(helpers.moduleDir, 'templates', 'temp-github-gitignore.txt'), 'utf8');
        fs.writeFileSync(this.deployGitIgnore, gitIgnore, 'utf8');

        return true;
    }
};
