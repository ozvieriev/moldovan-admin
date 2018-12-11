const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const gzip = require('gulp-gzip');
const concat = require('gulp-concat');
const flatmap = require('gulp-flatmap');
const htmlmin = require('gulp-htmlmin');
const mkdirRecursive = require('mkdir-recursive');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

const htmlminOptions = {
  collapseWhitespace: true,
  removeComments: true,
  sortAttributes: true,
  sortClassName: true
};

gulp.task('html:index', () => {

  return gulp.src('src/index.html')
    .pipe(htmlmin(htmlminOptions))
    .pipe(gulp.dest('dist'))
});
gulp.task('html:ui', () => {

  return gulp.src('src/ui/**/*.html')
    .pipe(htmlmin(htmlminOptions))
    .pipe(gulp.dest('dist/ui'))
});
gulp.task('html:index:watch', () => {
  return gulp.watch('src/index.html', gulp.series('html:index'));
});
gulp.task('html:ui:watch', () => {
  return gulp.watch('src/ui/**/*.html', gulp.series('html:ui'));
});
gulp.task('html', gulp.series(gulp.parallel('html:index', 'html:ui')));

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

gulp.task('css:font-awesome', () => {
  return gulp.src([
    'node_modules/font-awesome/css/font-awesome.min.css'
  ])
    .pipe(concat('font-awesome.min.css'))
    //.pipe(minifyCSS())
    .pipe(gulp.dest('dist/css/vendor'))
});
gulp.task('css:app:watch', () => {
  return gulp.watch('src/css/app/**/*.css', gulp.series('css:app'));
});
gulp.task('css', gulp.series(gulp.parallel('css:app', 'css:bootstrap', 'css:admin-lte', 'css:font-awesome')));

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


gulp.task('font:font-awesome', () => {

  return gulp.src([
    'node_modules/font-awesome/fonts/fontawesome-webfont.woff2'
  ])
    .pipe(gulp.dest('dist/css/fonts'))
});
gulp.task('font', gulp.series(gulp.parallel('font:font-awesome')));


gulp.task('build', gulp.series(gulp.parallel('html', 'css', 'js', 'font')));
gulp.task('watch', gulp.series(gulp.parallel(
  'css:app:watch',
  'html:index:watch', 'html:ui:watch',
  'js:app:watch')));

gulp.task('serve', function () {

  browserSync.init({ server: { baseDir: "./dist" } });

  gulp
    .watch(['dist/**/*.html', 'dist/**/*.css', 'dist/**/*.js'])
    .on("change", browserSync.reload);
});

gulp.task('default', gulp.series(gulp.parallel('build', 'watch', 'serve')));
gulp.task('gzip', () => {

  return gulp.src('dist/**')
    .pipe(gzip({ append: true }))
    .pipe(gulp.dest('gzip'))
});
gulp.task('gziph', () => {

  return gulp.src('gzip/**/*.gz')
    .pipe(flatmap(function (stream, file) {

      var relativePath = file.path.substr(file.base.length + 1);

      var hOutput = path.join(__dirname, 'gziph', relativePath);
      var hOutputDir = path.dirname(hOutput);
      var hFileName = relativePath.replace(/\\|\/|\.|-/g, "_");

      if (!fs.existsSync(hOutputDir))
        mkdirRecursive.mkdirSync(hOutputDir);

      var streamWriter = fs.createWriteStream(hOutput + '.h');
      streamWriter.on('error', function (error) {
        console.log(error);
      });

      var fileStream = fs.readFileSync(file.path);

      streamWriter.write(`#define ${hFileName}_len ${fileStream.length} \n`);
      streamWriter.write(`const uint8_t ${hFileName}[] PROGMEM = {`)

      for (var index = 0; index < fileStream.length; index++) {

        streamWriter.write('0x' + ('00' + fileStream[index].toString(16)).slice(-2));

        if (index < fileStream.length - 1)
          streamWriter.write(',');
      }

      streamWriter.write('};')
      streamWriter.end();

      return gulp.src(file.path);
    }))
});

gulp.task('release', gulp.series('build', 'gzip', 'gziph'));