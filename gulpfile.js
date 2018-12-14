const gulp = require('gulp');

require('fs').readdirSync('./tasks/').forEach(function (task) {
  require('./tasks/' + task);
});

gulp.task('build', gulp.series(gulp.parallel('html', 'css', 'js', 'font')));
gulp.task('release', gulp.series('build', 'gzip', 'gziph'));
gulp.task('default', gulp.series('clean', 'build', gulp.parallel('watch', 'serve')));