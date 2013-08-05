module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');

    var clientOptions = {
        name: './js/client/__load',
        baseUrl: './',
        out: './app/client/main.js',
        optimize: 'none'
    };

    grunt.initConfig({
        watch: {
            client_dev: {
                files: [
                    './js/client/**/*.js',
                    './js/client/**/*.html'
                ],
                tasks: ['requirejs:client_dev']
            }
        },
        requirejs: {
            client_dev: {
                options: clientOptions
            }
        },
        copy: {
            client_dev: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['./js/client/templates/*.html'],
                        dest: './app/client/template/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./js/client/external/*.js'],
                        dest: './app/client/external/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['./js/lib/*.js'],
                        dest: './app/lib/'
                    }
                ]
            }
        }
    });

    grunt.registerTask('default', ['copy', 'requirejs', 'watch']);
};