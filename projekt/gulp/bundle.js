// jshint esversion: 6
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('bundle', () => {
  let libs = ['node_modules/p5/lib/p5.js'];

  gulp.src(libs)
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/lib'));
});
