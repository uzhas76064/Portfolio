const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const gcmq = require('gulp-group-css-media-queries');
const postcss = require('gulp-postcss');
const less = require('gulp-less');
/*const pug = require('gulp-pug');*/


const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);

/*
	1. browserSync для html
	2.
		gulp-uncss - удаление неиспользуемого css
		gulp-group-css-media-queries - соединение media-запрос
	3. по желанию pug html препроц
*/

/*let cssFiles = [
	'./node_modules/normalize.css/normalize.css',
	'./src/styles/main.css'
];*/

function clear() {
	return del('app/*');
}

function styles() {
	return gulp.src('./src/styles/main.less')
	   .pipe(gulpif(isDev, sourcemaps.init()))
	   .pipe(less())
	   .pipe(concat('style.css'))
	   .pipe(gcmq())
	   .pipe(autoprefixer({
	        browsers: ['last 3 versions'],
	        cascade: false
		}))
	   //.pipe(postcss())
	   .pipe(gulpif(isProd, cleanCSS({
	   		level: 1
	   })))
	   .pipe(gulpif(isDev, sourcemaps.write()))
	   .pipe(gulp.dest('./app/styles'))
	   .pipe(gulpif(isSync, browserSync.stream()));
}

function img() {
	return gulp.src('./src/img/**/*')
	   .pipe(gulp.dest('./app/img'))
}

function icons() {
	return gulp.src('./src/icons/**/*')
		.pipe(gulp.dest('./app/icons'))
}

function html() {
	return gulp.src('./src/*.html')
	   .pipe(gulp.dest('./app'))
	   .pipe(gulpif(isSync, browserSync.stream()));
}

function watch() {
	if(isSync) {
		browserSync.init({
	        server: {
	            baseDir: "./app/",
	        }
	    });
	}

	gulp.watch('./src/styles/**/*.less', styles);
	gulp.watch('./src/*.html', html);
}

let build = gulp.series(clear,
	gulp.parallel(styles, img, html, icons)
);

gulp.task('build', build);
gulp.task('watch', gulp.series(build, watch));