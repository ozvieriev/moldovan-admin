const gulp = require('gulp');

require('fs').readdirSync('./tasks/').forEach(function (task) {
  require('./tasks/' + task);
});

gulp.task('build', gulp.series('clean', gulp.parallel('html', 'css', 'js', 'font')));
gulp.task('release', gulp.series('build', 'gzip', 'gziph'));
// gulp.task('qa', gulp.series('release'));
gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));