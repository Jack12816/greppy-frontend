/* global module:false */
module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        banner: {
            normal: '/*!\n * @name <%= pkg.name %>\n' +
                    ' * @date <%= grunt.template.today("yyyy-mm-dd HH:MM") %>\n' +
                    ' * @version <%= pkg.version %>\n */\n',
            min: '/*! @name <%= pkg.name %>' +
                 ' * @date <%= grunt.template.today("yyyy-mm-dd HH:MM") %>' +
                 ' * @version <%= pkg.version %> */'
        },

        concat: {
            js: {
                options: {
                    separator: ';',
                },
                src: [
                    'js/header.js',
                    'js/application.js',
                    'js/controller.js',
                    'js/validator.js',
                    'js/data-grid.js',
                    'js/data-grid/*.js',
                    'js/styler.js',
                    'js/styler/*.js',
                    'js/footer.js'
                ],
                dest: 'dist/js/greppy.js'
            }
        },

        uglify: {
            beautify: {
                options: {
                    beautify: {
                        beautify: true,
                        width: 80,
                        comments: true
                    },
                    drop_console: true,
                    banner: '<%= banner.normal %>'
                },
                files: {
                    'dist/js/greppy.js': [
                        '<%= concat.js.dest %>'
                    ]
                }
            },
            compress: {
                options: {
                    compress: true,
                    drop_console: true,
                    banner: '<%= banner.min %>'
                },
                files: {
                    'dist/js/greppy.min.js': [
                        '<%= concat.js.dest %>'
                    ]
                }
            }
        },

        less: {
            beautify: {
                options: {
                    paths: [
                        'less'
                    ]
                },
                files: {
                    'dist/css/greppy.css': 'less/greppy.less'
                }
            },
            compress: {
                options: {
                    compress: true,
                    cleancss: true,
                    paths: [
                        'less'
                    ]
                },
                files: {
                    'dist/css/greppy.min.css': 'less/greppy.less'
                }
            }
        },

        usebanner: {
            less: {
                options: {
                    position: 'top',
                    banner: '<%= banner.normal %>',
                    linebreak: true
                },
                files: {
                    src: [ 'dist/css/greppy.css' ]
                }
            },
            lessMin: {
                options: {
                    position: 'top',
                    banner: '<%= banner.min %>',
                    linebreak: false
                },
                files: {
                    src: [ 'dist/css/greppy.min.css' ]
                }
            }
        },

        watch: {
            main: {
                files: [
                    'Gruntfile.js',
                    'js/*',
                    'js/**/*'
                ],
                tasks: 'js'
            },
            views: {
                files: [
                    'Gruntfile.js',
                    'less/*',
                    'less/**/*'
                ],
                tasks: 'css'
            }
        }
    });

    // Dependencies
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Custom task
    grunt.registerTask('js', ['concat:js', 'uglify']);
    grunt.registerTask('css', ['less', 'usebanner:less', 'usebanner:lessMin']);

    // Default task
    grunt.registerTask('default', ['js', 'css']);
};

