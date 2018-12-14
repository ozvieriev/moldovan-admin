const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const gzip = require('gulp-gzip');
const flatmap = require('gulp-flatmap');
const mkdirRecursive = require('mkdir-recursive');
gulp.task('gzip', () => {

    return gulp.src('dist/**')
        .pipe(gzip({ append: true }))
        .pipe(gulp.dest('gzip'))
});
gulp.task('gziph', () => {

    return gulp.src('gzip/**/*.gz')
        .pipe(flatmap(function (stream, file) {

            var relativePath = file.path.substr(file.base.length + 1);
            var hOutput = path.join('./', 'gziph', relativePath);
            
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