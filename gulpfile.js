const gulp = require('gulp');
const browserify = require('browserify')

gulp.task('default', function() {
  const b = browserify('./app/browser/main.jsx', {builtins: false, bare: true, ignoreMissing: true});
  b.on('dep', dep => {
    console.log(dep.file);
  });
  b.bundle();
});
