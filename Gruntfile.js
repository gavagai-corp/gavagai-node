module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            spec: {
                options: {reporter: 'spec'},
                src: ['spec/*.js']
            },
            smoke: {
                options: {reporter: 'spec'},
                src: ['spec/smoke/*.js']
            }

        }
    });

    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', 'mochaTest:spec');
    grunt.registerTask('smoke', 'mochaTest:smoke');

};