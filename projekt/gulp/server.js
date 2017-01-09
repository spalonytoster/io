// jshint esversion: 6
const gulp = require('gulp');
const liveserver = require('gulp-live-server');

gulp.task('serve', () => {
  //1. serve with default settings
  let server = liveserver.static('app', 3000);
  server.start();

  //use gulp.watch to trigger server actions(notify, start or stop)
  gulp.watch(['app/**/*.js', 'app/**/*.css', 'app/**/*.html'], (file) => {
    server.notify.apply(server, [file]);
  });
});
