const gulp = require('gulp');
const browserify = require('browserify');
var reactify = require('reactify');
const path = require('path');
const fse = require('fs-extra');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('copyNodeModules', () => {
  const basePath = path.join(__dirname, 'app');
  const newPath = path.join(__dirname, 'builds');
  fse.ensureDirSync(newPath);
  const b = browserify('./app/browser/main.jsx', {builtins: false, bare: true, ignoreMissing: true, transform: [reactify]});
  b.on('dep', dep => {
    const f = dep.file.replace(basePath, newPath);
    if (f.startsWith(path.join(newPath, 'node_modules'))) {
      fse.copySync(dep.file, f);
    }
  });
  b.bundle(() => console.log("All node modules copied"));
});

gulp.task('copy', () => {
  fse.ensureDirSync('./builds');
  gulp.src('./app/*.png').pipe(gulp.dest('./builds'));
  gulp.src('./app/index.html').pipe(gulp.dest('./builds'));
  gulp.src('./app/index.js').pipe(gulp.dest('./builds'));
  gulp.src('./app/package.json').pipe(gulp.dest('./builds'));
  fse.copySync('./app/node_modules/material-design-lite/material.min.css', './builds/node_modules/material-design-lite/material.min.css')
  fse.copySync('./app/node_modules/material-design-lite/material.min.js', './builds/node_modules/material-design-lite/material.min.js')
});

gulp.task('browserify', () => {
  fse.ensureDirSync('./builds');
  const b = browserify('./app/browser/main.jsx', {bundleExternal: false, ignoreMissing: true, transform: [reactify]});
  b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./builds'));
});

gulp.task('clean', () => {
  fse.removeSync('./builds')
});

gulp.task('default', ['copy', 'browserify', 'copyNodeModules']);
