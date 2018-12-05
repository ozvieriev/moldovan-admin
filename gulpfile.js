var gulp = require('gulp');
//var pug = require('gulp-pug');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
//var sourcemaps = require('gulp-sourcemaps');



gulp.task('html:index', () => {

  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
});

gulp.task('html:views', () => {

  return gulp.src('src/views/**/*.html')
    .pipe(gulp.dest('dist/views'))
});

gulp.task('html', gulp.series(gulp.parallel('html:index', 'html:views')));


gulp.task('css:bootstrap', function () {
  return gulp.src([
    'node_modules/bootstrap/dist/css/bootstrap.min.css'
  ])
    .pipe(concat('bootstrap.min.css'))
    //.pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'))
});
gulp.task('css:admin-lte', function () {
  return gulp.src([
    'src/css/admin-lte/css/adminlte.min.css',
    'src/css/admin-lte/css/skins/skin-blue.min.css'
  ])
    .pipe(concat('admin-lte.min.css'))
    //.pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'))
});

gulp.task('css', gulp.series(gulp.parallel('css:bootstrap', 'css:admin-lte')));


gulp.task('js:app', function () {

  return gulp.src('src/js/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'))
});
gulp.task('js:angular', function () {

  return gulp.src([
    'node_modules/angular/angular.min.js',
    'node_modules/angular-route/angular-route.min.js',
    'node_modules/angular-websocket/dist/angular-websocket.min.js'
  ])
    .pipe(concat('angular.min.js'))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('js', gulp.series(gulp.parallel('js:app', 'js:angular')));

gulp.task('default', gulp.series(gulp.parallel('html', 'css', 'js')));



// gulp.task('serve', gulp.series(gulp.parallel('default'), function () {

//   return gulp.src('dist')
//     .pipe(webserver({
//       port: 3000,
//       livereload: true
//     }));
// }))