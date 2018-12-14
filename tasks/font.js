const gulp = require('gulp');

gulp.task('font:bootstrap', () => {

    return gulp.src([
        'node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2'
    ])
        .pipe(gulp.dest('dist/fonts'))
});
gulp.task('font', gulp.series(gulp.parallel('font:bootstrap')));