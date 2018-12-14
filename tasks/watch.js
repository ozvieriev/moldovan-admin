const gulp = require('gulp');

gulp.task('watch', gulp.series(gulp.parallel(
    'css:app:watch',
    'html:app:watch',
    'js:app:watch')));