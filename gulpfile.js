// Load plugins
var gulp = require('gulp'),
	buffer = require('vinyl-buffer');
	csso = require('gulp-csso');
	imagemin = require('gulp-imagemin');
	merge = require('merge-stream');
	spritesmith = require('gulp.spritesmith'),
	concatCss = require('gulp-concat-css'),
	compass = require('gulp-compass'),
	streamqueue = require('streamqueue'),
	minify = require('gulp-minify'),
	concat = require('gulp-concat');

var paths = {
	scss: ['sass/*.scss', 'sass/*/*.scss']
};

// Compass task
gulp.task('compass', function() {
	gulp.src('sass/*.scss')
	.pipe(compass({
		config_file: 'config.rb',
		css: 'css/',
		sass: 'sass'
	})).pipe(gulp.dest(''));
});

// Spite task
gulp.task('sprite', function () {
  // Generate our spritesheet
  var spriteData = gulp.src('images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest('images/sprites/'));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    .pipe(csso())
    .pipe(gulp.dest('css/'));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});

gulp.task('concat', function () {
  return gulp.src('css/*.css')
    .pipe(concatCss("style.css"))
    .pipe(gulp.dest('css/'));
});

gulp.task('scripts', function() {
    return streamqueue({ objectMode: true },
        gulp.src('js/vendor/*.js'),
        gulp.src('js/*.js')
    )
    .pipe(concat('app.js'))
    .pipe(gulp.dest(''));
});
// gulp.task('compress', function() {
//   gulp.src('js/app.js')
//     .pipe(minify({
//         // exclude: ['tasks'],
//         // ignoreFiles: ['.combo.js', '-min.js']
//     }))
//     .pipe(gulp.dest('js/app.js'))
// });

/* TO DO */
// Add CSS Minify
// Add JS Concat 
// Add JS Minify
// Order files to Concat + Minify
// 
// OR research Magento alternative

// Default task
gulp.task('default', function() {
	gulp.watch(paths.scss, ['compass']);
	gulp.watch(paths.scss, ['sprite']);
	gulp.watch(paths.scss, ['concat']);
	gulp.watch(paths.scss, ['scripts']);
	// gulp.watch(paths.scss, ['compress']);
});