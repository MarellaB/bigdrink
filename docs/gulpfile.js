/* NODE REQUIREMENTS (Written broken up simply for appearance sake)
npm install --save-dev gulp gulp-concat gulp-sass gulp-server-livereload mkdirp
npm install --save-dev gulp-server-livereload gulp-sourcemaps gulp-uglify gulp-util

*/

// NOTE -- Run gulp with '--type production' when sending to firebase or other
//          host, compresses and uglifies code.
// NOTE -- Run gulp with '--type showlogs' to show client side logs on server side.
//Primary Requires
var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    server  = require('gulp-server-livereload'),
    mkdirp  = require('mkdirp');
//JS Requires
var uglify = require('gulp-uglify'),
    concat = require('gulp-concat');
//Sass Requires
var sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps');

//Run and manage all style sheets
gulp.task('styles', () => {
  //TODO - Remove source mapping from publish
  return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())  //Process the original sources
    .pipe(sass({outputStyle: gutil.env.type === 'production' ?
      'compressed' : 'expanded'})
      .on('error', sass.logError))
    .pipe(sourcemaps.write()) //Add the map to modified source
    .pipe(gulp.dest(gutil.env.type === 'production' ?
      'public/assets/stylesheets' : 'dist/assets/stylesheets'));
});

//Run and manage all js scripts for development
gulp.task('scripts', () => {
  //TODO - Remove source mapping from publish
  return gulp.src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('master.min.js'))
    //Only uglify if gulp is ran with '--type production'
    .pipe(gutil.env.type === 'production' ?
      uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(gutil.env.type === 'production' ?
      'public/assets/js' : 'dist/assets/js'));
});

//Run and manage all html files
//TODO - Minfiy HTML
//TODO - Incorporate Handlebars
gulp.task('html', () => {
  return gulp.src('src/*.html')
    .pipe(gulp.dest(gutil.env.type === 'production' ?
      'public' : 'dist'));
});

//Begins the webserver
gulp.task('webserver', ['html', 'scripts', 'styles'], () => {
  return gulp.src('dist')
    .pipe(server({
      host: '0.0.0.0',
      port: 8080,
      livereload: {
        enable: true,
        port: '8081',
        clientConsole: gutil.env.type === 'showlogs'
      },
      open: true
    }));
})

//Watch all files for changes and update as necessary
gulp.task('watch', () => {
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/scss/**/*.scss', ['styles']);
  gulp.watch('src/**/*.html', ['html']);
});

gulp.task('default', ['webserver', 'watch'], () => {
  gutil.log('', gutil.colors.cyan('Runner Began'));
});

//Used when inializing a new workspace
gulp.task('init', () => {
  mkdirp('./src', (err) => {
    if (err) console.error(err); else gutil.log('Created File: ',
      gutil.colors.red('./src'));
  });
  mkdirp('./src/scss', (err) => {
    if (err) console.error(err); else gutil.log('Created File: ',
      gutil.colors.red('./src/scss'));
  });
  mkdirp('./src/js', (err) => {
    if (err) console.error(err); else gutil.log('Created File: ',
      gutil.colors.red('./src/js'));
  });
  return true;
});