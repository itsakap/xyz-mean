// gulpfile.js
var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var recess = require('gulp-recess');
var header = require('gulp-header');
var gulpFilter = require('gulp-filter');
var complexity = require('gulp-complexity');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');
var banner = ['/**',
    ' * XYZ',
    ' * (c) 2014 Adam Kaplan',
    ' * License: MIT',
    ' * Last Updated: <%= new Date().toUTCString() %>',
    ' */',
    ''].join('\n');
 
gulp.task('minify', function() {
    var templatesFilter = gulpFilter('xyz-means/templates/*.html');
 
    return gulp.src([
        'xyz-mean/vendor/angular.js',
        'xyz-mean/vendor/*.js',
        'xyz-mean/app.js',
        'xyz-mean/templates.js',
        'xyz-mean/services/*.js',
        'xyz-mean/directives/*.js',
        'xyz-mean/controllers/*.js'
    ])
        .pipe(templatesFilter)
        .pipe(templateCache({ root: 'templates', module: 'xyz' }))
        .pipe(templatesFilter.restore())
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(header(banner))
        .pipe(gulp.dest('xyz-mean'));
});
gulp.task('complexity', function() {
    return gulp.src([
        '!xyz-mean/vendor/*.*',
        '!xyz-mean/app.min.js',
        'xyz-mean/**/*.js'
    ])
        .pipe(complexity());
});
gulp.task('styles', function() {
  gulp.src([
    // 'xyz-mean/css/sweet-alert.css',
    'xyz-mean/css/custom.css',
    'xyz-mean/css/foundation-icons.css',
    'xyz-mean/css/foundation.css',
    'xyz-mean/css/normalize.css',
    'xyz-mean/css/ng-quick-date.plus-default-theme.css'
  ])
    .pipe(concat('styles.min.css'))
    .pipe(csso())
    .pipe(gulp.dest('xyz-mean/css'));
});
 
gulp.task('recess', function() {
 gulp.src('xyz-mean/css/custom.css')
 .pipe(recess())
 .pipe(recess.reporter())
 .pipe(gulp.dest('xyz-mean/css'));
});
gulp.task('watch', function() {
  gulp.watch(['xyz-mean/css/*.css', '!xyz-mean/css/styles.min.css'], ['styles']);
  gulp.watch([
    'xyz-mean/app.js',
    'xyz-mean/services/*.js',
    'xyz-mean/directives/*.js',
    'xyz-mean/controllers/*.js',
    'xyz-mean/templates/*.html'
  ], ['minify']);
});
gulp.task('default', ['watch', 'styles', 'minify']);