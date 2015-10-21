var browserify = require('browserify'),
    gulp       = require('gulp'),
    uglify     = require('gulp-uglify'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer');

gulp.task('browserify', function() {
    return browserify({
            entries: ['./src/batch.js'],
            standalone: 'batch'
        })
        .exclude('promise')
        .bundle()
        .pipe(source('batch.js'))
        .pipe(gulp.dest('./'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./min/'));
});
