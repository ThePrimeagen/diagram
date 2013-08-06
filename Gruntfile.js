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
    var commonOptions = {
        name: './js/common/__load',
        baseUrl: './',
        out: './app/common/main.js',
        optimize: 'none'
    };

    grunt.initConfig({
        watch: {
            client_dev: {
                files: [
                    './js/client/**/*.js',
                    './js/client/**/*.html'
                ],
                tasks: ['copy:client_dev', 'requirejs:client_dev']
            },
            server_dev: {
                files: [
                    './js/server/**/*.js'
                ],
                tasks: ['copy:server_dev']
            },
            common_dev: {
                files: [
                    './js/common/**/*.js'
                ],
                tasks: ['requirejs:common_dev']
            }
        },
        requirejs: {
            client_dev: {
                options: clientOptions
            },
            common_dev: {
                options: commonOptions
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
            },
            server_dev: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['./js/server/*.js'],
                        dest: './app/server/'
                    }
                ]
            }
        }
    });

    grunt.registerTask('default', ['copy', 'requirejs', 'watch']);
};