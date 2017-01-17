// jshint esversion: 6
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('bundle', () => {
  let libs = [
    'node_modules/p5/lib/p5.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/lodash/lodash.js',
    'node_modules/genetic-js/lib/genetic.js'
  ];

  gulp.src(libs)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/lib'));
});
