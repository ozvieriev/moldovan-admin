const fn = require('gulp-fn');
const del = require('del');
const gulp = require('gulp');
const path = require('path');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const concat = require('gulp-concat');

gulp.task('js:app', () => {

    return gulp.src('src/js/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        // .pipe(minify({
        //     ext: {
        //         src: '.js',
        //         min: '.min.js'
        //     },
        //     mangle: false,
        //     ignoreFiles: ['.min.js']
        // }))
        .pipe(gulp.dest('dist/js'))
        .pipe(fn(function (file) {

            if (path.basename(file.path) === 'app.js')
                del(file.path);
        }));
});
gulp.task('js:vendor', () => {

    return gulp.src([
        'node_modules/angular/angular.min.js',
        'node_modules/angular-ui-router/release/angular-ui-router.min.js',
        'node_modules/angular-websocket/dist/angular-websocket.min.js'
    ])
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('dist/js'))
});
gulp.task('js:app:watch', () => {
    return gulp.watch('src/js/**/*.js', gulp.series('js:app'));
});
gulp.task('js', gulp.series(gulp.parallel('js:app', 'js:vendor')));