const gulp = require('gulp')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const jscs = require('gulp-jscs')
const stylish = require('gulp-jscs-stylish')

const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const dependencies = require('gulp-resolve-dependencies')

/* BACKEND TASKS */
gulp.task('backend:js', () => {
	return gulp.src('backend/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest('dist'))
})

const backendFilesStatic = ['backend/config.json']

gulp.task('backend:static', () => {
	return gulp.src(backendFilesStatic)
		.pipe(gulp.dest('dist'))
})

gulp.task('backend:build', ['backend:js', 'backend:static'], function () {
})

gulp.task('backend:lint', () => {
	return gulp.src(['backend/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(jscs())
		.pipe(stylish())
})

gulp.task('backend:watch', () => {
	gulp.watch(backendFilesStatic, ['backend:static'])
	gulp.watch('backend/**/*.js', ['backend:js', 'backend:lint'])
	gulp.watch('backend/*.js', ['backend:js', 'backend:lint'])
})

/* FRONTEND TASKS */
gulp.task('frontend:css', () => {
	return gulp.src('frontend/css/*.css')
		.pipe(gulp.dest('dist/frontend'))
})

gulp.task('frontend:libs', () => {
	return gulp.src('frontend/libs/*.js')
		.pipe(gulp.dest('dist/frontend/'))
})

gulp.task('frontend:js', () => {
	return gulp.src('frontend/**/*.js')
		.pipe(dependencies())
		.pipe(sourcemaps.init())
		.pipe(concat('main.js'))
		.pipe(babel())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/frontend/'))
})

gulp.task('frontend:html', () => {
	return gulp.src('frontend/**/*.html')
		.pipe(gulp.dest('dist/frontend'))
})

gulp.task('frontend:build', ['frontend:libs', 'frontend:js', 'frontend:css', 'frontend:html'], function () {
})

gulp.task('frontend:lint', () => {
	return gulp.src(['frontend/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(jscs())
		.pipe(stylish())
})

gulp.task('frontend:watch', () => {
	gulp.watch('frontend/**/*', ['frontend:build'])
})

/* FULL TASKS */
gulp.task('lint', ['backend:lint', 'frontend:lint'], function() {
})

gulp.task('watch', ['backend:watch', 'frontend:watch'], function() {
})

gulp.task('build', ['backend:build', 'frontend:build'], function() {
})
