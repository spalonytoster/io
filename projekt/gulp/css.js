// jshint esversion: 6
const gulp = require('gulp');
const stylus = require('gulp-stylus');
const livereload = require('gulp-livereload');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

const options = {
  port: 35730
};

gulp.task('css', () => {
  gulp.src('stylesheets/**/*.styl')
    .pipe(stylus())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets'))
    .pipe(livereload(options));
});

gulp.task('watch:css', ['css'], () => {
  livereload.listen(options);
  gulp.watch('stylesheets/**/*.styl', ['css']);
});
