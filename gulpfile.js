'use strict';
// npm install -g npm-check
// npm-check - use for check updates.

var gulp = require('gulp'); 
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rigger = require('gulp-rigger');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var cssnano = require('gulp-cssnano');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var serverConfig = {
    server: {
        baseDir: './build'
    },
    host: 'localhost',
    port: 9000,
    logPrefix: 'NASA',
    notify: false
};

gulp.task('sass', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('stylesheet.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('bundleFonts', function() {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('./build/fonts'));
});

gulp.task('bundleImg', function() {
    return gulp.src('./src/img/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest('./build/img'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('html', function () {
    return gulp.src('./src/*.html')
        .pipe(rigger())
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function () {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch('./src/img/*.+(png|jpg|gif|svg)', ['bundleImg']);
    gulp.watch('./src/*.html', ['html']);
    gulp.watch('./src/html/*.html', ['html']);
    gulp.watch('./src/fonts/**/*.*', ['bundleFonts']);
});

gulp.task('svg', function () {
    return gulp.src('./src/svg/*.svg')
        .pipe(gulp.dest('./build/svg'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('webServer', function () {
    browserSync(serverConfig);
});

gulp.task('clean:build', function () {
    return del.sync('./build');
});

gulp.task("start",["clean:build","html", "sass", "svg", "bundleImg","bundleFonts", "webServer", "watch"]);


