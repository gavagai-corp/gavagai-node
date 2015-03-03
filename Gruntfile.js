module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            spec: {
                options: {reporter: 'spec'},
                src: ['spec/*.js']
            },
            integration: {
                options: {reporter: 'spec'},
                src: ['spec/integrationTests/*.js']
            }

        }
    });

    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', 'mochaTest:spec');
    grunt.registerTask('integration', 'mochaTest:integration');

};