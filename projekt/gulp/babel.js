// jshint esversion: 6
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('babel', () => {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    // .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets'));
});

gulp.task('watch:babel', ['babel'], () => {
  gulp.watch('src/**/*.js', ['babel']);
});
