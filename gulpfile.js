// USF Splash Page World Water Day Gulpfile
// (c) Blue State Digital

// TASKS
// ------
// `gulp`: watch, compile styles and scripts
// `gulp build`: default compile task


// PLUGINS
// --------
var autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    notify = require('gulp-notify'),
    p = require('./package.json'),
    path = require('path'),
    pxtorem = require('gulp-pxtorem'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify');


// VARIABLES
// ----------
var dist = 'dist/',
    source = 'src/';


// ERROR HANDLING
// ---------------
function handleError() {
    this.emit('end');
}

// BUILD SUBTASKS
// ---------------

var pxtoremOptions = {
    root_value: 16,
    unit_precision: 4,
    prop_white_list: [],
    selector_black_list: [],
    replace: false,
    media_query: false
};

var postcssOptions = {
};

// Styles
gulp.task('styles_dev', function() {
    return gulp.src([
        source+'scss/style.scss'
    ])
    .pipe(sass()
        .on('error', handleError)
        .on('error', notify.onError()))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(pxtorem(pxtoremOptions, postcssOptions))
    .pipe(rename({suffix: '.dev'}))
    .pipe(gulp.dest(dist+'css/'))
    .pipe(reload({stream: true}));
});

gulp.task('styles', function() {
    return gulp.src([
        source+'scss/style.scss'
    ])
    .pipe(sass()
        .on('error', handleError)
        .on('error', notify.onError()))
    .pipe(autoprefixer())
    .pipe(pxtorem(pxtoremOptions, postcssOptions))
    .pipe(cssnano())
    .pipe(gulp.dest(dist+'css/'));
});

// Copy Files
gulp.task('copy', ['scripts', 'styles'], function() {
    gulp.src(source+'index.html')
    .pipe(gulp.dest(dist))
    .pipe(reload({stream: true}));
});

// Script Linter
gulp.task('lint', function() {
    return gulp.src(source+'js/main.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Scripts
gulp.task('scripts', ['lint'], function() {
    return gulp.src([
        source+'js/lib/_*.js',
        source+'js/main.js'
    ])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(dist+'js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dist+'js'))
    .pipe(reload({stream: true}));
});



// BUILD TASKS
// ------------

// Watch
gulp.task('default', function() {

    browserSync({
        proxy: "usf-splash-worldwaterday.dev"
    });

    // Watch .scss files
    gulp.watch(source+'scss/**/*.scss', ['styles_dev', 'copy']);

    // Watch .js files
    gulp.watch(source+'js/**/*.js', ['scripts', 'copy']);

    // Watch index file
    gulp.watch(source+'index.html', ['copy']);

});

// Build
gulp.task('build', function() {
    gulp.start('styles', 'scripts', 'copy');
});
