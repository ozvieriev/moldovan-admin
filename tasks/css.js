const gulp = require('gulp');
const concat = require('gulp-concat');

gulp.task('css:app', () => {
    return gulp.src([
        'src/css/app/**/*.css'
    ])
        .pipe(concat('app.css'))
        //.pipe(minifyCSS())
        .pipe(gulp.dest('dist/css'))
});
gulp.task('css:vendor', () => {
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'src/css/admin-lte/css/adminlte.min.css',
        'src/css/admin-lte/css/skins/skin-blue.min.css',
        'node_modules/balloon-css/balloon.min.css',
    ])
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest('dist/css'))
});
gulp.task('css:app:watch', () => {
    return gulp.watch('src/css/**/*.css', gulp.series('css:app'));
});
gulp.task('css', gulp.series(gulp.parallel('css:app', 'css:vendor')));