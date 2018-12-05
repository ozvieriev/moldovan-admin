var gulp = require('gulp');
var concat = require('gulp-concat');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('html:index', () => {

  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist'))
});
gulp.task('html:views', () => {

  return gulp.src('src/views/**/*.html')
    .pipe(gulp.dest('dist/views'))
});
gulp.task('html:index:watch', () => {
  return gulp.watch('src/index.html', gulp.series('html:index'));
});
gulp.task('html:views:watch', () => {
  return gulp.watch('src/views/**/*.html', gulp.series('html:views'));
});
gulp.task('html', gulp.series(gulp.parallel('html:index', 'html:views')));

gulp.task('css:app', () => {
  return gulp.src([
    'src/css/app/**/*.css'
  ])
    .pipe(concat('style.css'))
    //.pipe(minifyCSS())
    .pipe(gulp.dest('dist/css/app'))
});
gulp.task('css:bootstrap', () => {
  return gulp.src([
    'node_modules/bootstrap/dist/css/bootstrap.min.css'
  ])
    .pipe(concat('bootstrap.min.css'))
    //.pipe(minifyCSS())
    .pipe(gulp.dest('dist/css/vendor'))
});
gulp.task('css:admin-lte', () => {
  return gulp.src([
    'src/css/admin-lte/css/adminlte.min.css',
    'src/css/admin-lte/css/skins/skin-blue.min.css'
  ])
    .pipe(concat('admin-lte.min.css'))
    //.pipe(minifyCSS())
    .pipe(gulp.dest('dist/css/vendor'))
});
gulp.task('css:app:watch', () => {
  return gulp.watch('src/css/app/**/*.css', gulp.series('css:app'));
});
gulp.task('css', gulp.series(gulp.parallel('css:app', 'css:bootstrap', 'css:admin-lte')));

gulp.task('js:app', () => {

  return gulp.src('src/js/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js/app'))
});
gulp.task('js:angular', () => {

  return gulp.src([
    'node_modules/angular/angular.min.js',
    'node_modules/angular-route/angular-route.min.js',
    'node_modules/angular-websocket/dist/angular-websocket.min.js'
  ])
    .pipe(concat('angular.min.js'))
    .pipe(gulp.dest('dist/js/vendor'))
});
gulp.task('js:app:watch', () => {
  return gulp.watch('src/js/**/*.js', gulp.series('js:app'));
});
gulp.task('js', gulp.series(gulp.parallel('js:app', 'js:angular')));

gulp.task('build', gulp.series(gulp.parallel('html', 'css', 'js')));
gulp.task('watch', gulp.series(gulp.parallel(
  'css:app:watch',
  'html:index:watch', 'html:views:watch',
  'js:app:watch')));

gulp.task('serve', function () {

  browserSync.init({ server: { baseDir: "./dist" } });

  gulp
    .watch(['dist/**/*.html', 'dist/**/*.css', 'dist/**/*.js'])
    .on("change", browserSync.reload);
});

gulp.task('default', gulp.series(gulp.parallel('build', 'watch', 'serve')));