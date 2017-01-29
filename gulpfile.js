// load the plugins
var gulp       = require('gulp');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

// minify and concat angular files (cannot be done as standard js files due to angular restrictions)
gulp.task('angular', function() {
  return gulp.src(['public/app/*.js', 'public/app/**/*.js'])
         .pipe(ngAnnotate())
         .pipe(concat('app.js'))
         .pipe(uglify())
         .pipe(gulp.dest('public/dist'));
});

gulp.task('generate-service-worker', function(callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');
  var rootDir = 'public';

  swPrecache.write(path.join(rootDir, 'sw.js'), {
    staticFileGlobs: [
    									rootDir + '/install-sw.js',
    									rootDir + '/{app,img}/**/*.{js,html,css,png,jpg,gif}',
    									rootDir + '/assets/img/*.{png,jpg,gif}',
    									rootDir + '/assets/css/style.min.css',
    									rootDir + '/dist/app.js',
    									rootDir + '/assets/libs/angular/angular.min.js',
    									rootDir + '/assets/libs/angular-route/angular-route.min.js',
    									rootDir + '/assets/libs/angular-animate/angular-animate.min.js',
    									rootDir + '/assets/libs/angular-aria/angular-aria.min.js',
    									rootDir + '/assets/libs/angular-cookies/angular-cookies.min.js',
    									rootDir + '/assets/libs/angular-material/angular-material.min.js',
    									rootDir + '/assets/libs/angular-material/angular-material.min.css',
    									rootDir + '/assets/libs/angular-jwt/dist/angular-jwt.min.js',
    									rootDir + '/assets/libs/moment/min/moment.min.js',
    									rootDir + '/assets/libs/angular-filter/dist/angular-filter.min.js',
    									rootDir + '/assets/libs/papaparse/papaparse.min.js',
    									rootDir + '/assets/libs/angular-messages/angular-messages.min.js',
    									rootDir + '/assets/svg-assets-cache.js',
    								 ],
    stripPrefix: rootDir,
    dynamicUrlToDependencies: {
    	'/offline': ['public/app/views/index.html', 'public/app/views/pages/offline.html'],
    },
    ignoreUrlParametersMatching: [/.*\/api.*/],
    navigateFallback: '/offline',
  }, callback);
});