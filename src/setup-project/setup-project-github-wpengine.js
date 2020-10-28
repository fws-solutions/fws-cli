/**
 * Create Github Pipeline
 *
 * @description CLI script for creating .github config for WPEngine pipeline.
 */
const fs = require('fs');
const path = require('path');
const helpers = require('../helpers');

module.exports = {
    themeName: '',
    devSlug: '',
    githubDir: path.join(process.cwd(), '/.github/workflows/dev-deployment.yml'),

    init: function(themeName, devName) {
        this.themeName = themeName;
        this.devSlug = devName.replace('.wpengine.com', '');

        return this.createGithubConfig();
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
    }
};
