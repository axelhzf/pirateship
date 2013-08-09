module.exports = (grunt) ->

    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-watch'

    grunt.initConfig({
        watch:
            coffee:
                files : ['src/**/*.coffee']
                tasks : ['coffee:all']

        coffee :
            all:
                options :
                    sourceMap: true
                expand: true,
                flatten: true,
                cwd: 'src',
                src: ['*.coffee'],
                dest: 'lib',
                ext: '.js'
    })