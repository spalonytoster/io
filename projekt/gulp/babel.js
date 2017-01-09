// jshint esversion: 6
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

gulp.task('babel', () => {
  return gulp.src('src/app.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('app/assets'));
});

gulp.task('watch:babel', ['babel'], () => {
  gulp.watch('src/app.js', ['babel']);
});
