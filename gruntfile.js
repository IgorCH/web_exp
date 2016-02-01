// npm install -g grunt-cli
// npm install
// grunt
// grunt watch --force

module.exports = function (grunt) {
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // Combine all files in src/
    grunt.initConfig({
        'uglify': {
            app_dev: {
                src: [
                    'js/modules/**/*.js',
                    'js/framework/**/*.js',
                    'js/app.js',
                    'js/config/**/*.js',
                    'js/filters/**/*.js',
                    'js/factories/**/*.js',
                    'js/directives/**/*.js',
                    'js/controllers/**/*.js',
                    '!js/**/*_prod.js'
                ],
                dest: 'assets_compiled/js/app.min.js',
                flatten: true,
                beautify: true,
                expand: true
            },
            app_prod: {
                src: [
                    'js/modules/**/*.js',
                    'js/framework/**/*.js',
                    'js/app.js',
                    'js/config/**/*.js',
                    'js/filters/**/*.js',
                    'js/factories/**/*.js',
                    'js/directives/**/*.js',
                    'js/controllers/**/*.js',
                    '!js/**/*_dev.js'
                ],
                dest: 'assets_compiled/js/app.min.js',
                flatten: true
            },
            vendor: {
                src: [
                    'vendor/js/jquery-2.1.4.min.js',
                    'vendor/js/angular.min.js',
                    'vendor/js/angular-resource.min.js',
                    'vendor/js/angular-route.min.js',
                    'vendor/js/angular-animate.min.js',
                    'vendor/js/angular-aria.min.js',
                    'vendor/js/angular-material.min.js',
                    'vendor/js/angular-material-icons.min.js',
                    'vendor/js/angular-ui-router.js',
                    'vendor/js/v-accordion.min.js',
                    'vendor/js/date_utilities.js',
                    'vendor/js/ng-file-upload-shim.min.js',
                    'vendor/js/ng-file-upload.min.js'
                ],
                dest: 'assets_compiled/js/vendors.min.js',
                flatten: true
            }
        },
        cssmin: {
            options: {
                separator: '\n\n'
            },
            target_prod: {
                files: [
                    {
                        src: [
                            'vendor/css/**/*.css',
                            'css/**/*.css'
                        ],
                        dest: 'assets_compiled/css/app.min.css'
                    }
                ]
            },
            target_dev: {
                files: [
                    {
                        src: [
                            'vendor/css/**/*.css'
                        ],
                        dest: 'assets_compiled/css/vendor.min.css'
                    }
                ]
            }
        },
        concat: {
            dev: {
                options: {
                    separator: '\n'
                },
                src: [
                    'js/modules/**/*.js',
                    'js/framework/**/*.js',
                    'js/app.js',
                    'js/config/**/*.js',
                    'js/filters/**/*.js',
                    'js/factories/**/*.js',
                    'js/directives/**/*.js',
                    'js/controllers/**/*.js',
                    '!js/**/*_prod.js'
                ],
                dest: 'assets_compiled/js/app.min.js'
            },
            prod: {
                options: {
                    separator: '\n'
                },
                src: [
                    'js/modules/**/*.js',
                    'js/framework/**/*.js',
                    'js/app.js',
                    'js/config/**/*.js',
                    'js/filters/**/*.js',
                    'js/factories/**/*.js',
                    'js/directives/**/*.js',
                    'js/controllers/**/*.js',
                    '!js/**/*_dev.js'
                ],
                dest: 'assets_compiled/js/app.min.js'
            }
        },
        watch: {
            js: {
                files: 'js/**/*.js',
                tasks: [ 'concat:dev' ],
                options: {
                    separator: '\n',
                    spawn: false
                }
            },
            css: { files: 'css/**/*.css', tasks: [ 'cssmin:target_dev' ] },
            options: {
                interrupt: true
            }
        }
    });

    // exclude path use '!'

// load plugins
    //grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-uglify');

// register at least this one task
    grunt.registerTask('default', [ 'concat:dev' ]);
    grunt.registerTask('app_prod', ['uglify:app_prod']);
    grunt.registerTask('js_vendor', ['uglify:vendor']);
    grunt.registerTask('min_all_css', ['cssmin:target_prod']);
    grunt.registerTask('min_vendor_css', ['cssmin:target_dev']);
};