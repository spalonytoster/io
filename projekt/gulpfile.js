// jshint esversion: 6
const gulp = require('gulp');
const fs = require('fs');

fs.readdirSync(__dirname + '/gulp').forEach((task) => {
  require('./gulp/' + task);
});

gulp.task('watch', ['watch:babel', 'watch:css']);
gulp.task('build', ['bundle']);

gulp.task('dev', ['watch', 'serve']);
gulp.task('run', ['babel', 'css', 'serve']);
