var gulp = require('gulp'),
    haml = require('gulp-ruby-haml'),
    sass = require('gulp-sass'),
    coffee = require('gulp-coffee'),
    autoprefixer = require('gulp-autoprefixer'),
    csscomb = require('gulp-csscomb'),
    livereload = require('gulp-livereload'),
    coffeex = require('gulp-coffee-react'),
    imagemin = require('gulp-imagemin'),
    spritesmith = require('gulp.spritesmith'),
    concat = require('gulp-concat'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    nib = require('nib');
 
 
/*
 * Создаём задачи 
 *
 * sass – для CSS-препроцессора sass
 * haml – для HTML-препроцессора Haml
 * coffee – для JavaScript-препроцессора CoffeеScript
 * concat – для склейки всех CSS и JS в отдельные файлы
 */
 
gulp.task('sass', function() {
  gulp.src('./sass/*.scss')
    .pipe(sass({use: nib(), compress: true}))
	  .pipe(sass().on('error', sass.logError)) // Выводим ошибки в консоль
	  .pipe(gulp.dest('./public/css/')) // Выводим сгенерированные CSS-файлы в ту же папку по тем же именем, но с другим расширением
	  .pipe(livereload()); // Перезапускаем сервер LiveReload
});
 
gulp.task('haml', function(){
	gulp.src('./*.haml')
		.pipe(haml({pretty: true}))
		.on('error', console.log) // Выводим ошибки в консоль
	  .pipe(gulp.dest('./public/')) // Выводим сгенерированные HTML-файлы в ту же папку по тем же именем, но с другим расширением
	  .pipe(livereload()); // Перезапускаем сервер LiveReload
});

gulp.task('coffee',function(){
  gulp.src('./coffee/*.coffee')
    .pipe(coffee({ bare: true })).on('error', console.log)
    .pipe(gulp.dest('./public/js/')) // Выводим сгенерированные JavaScript-файлы в ту же папку по тем же именем, но с другим расширением
    .pipe(livereload()); // Перезапускаем сервер LiveReload
});


// gulp.task('coffeex', function() {
//   gulp.src('./src/*.coffee')
//     .pipe(coffeex({bare: true}).on('error', gutil.log))
//     .pipe(gulp.dest('./public/js/'))
//     .pipe(livereload()); // Перезапускаем сервер LiveReload
// });

gulp.task('prefix', function () {
  gulp.src('./sass/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(csscomb())
    .pipe(gulp.dest('./public/css/'))
    .pipe(livereload()); // Перезапускаем сервер LiveReload
});

gulp.task('concat', function(){
  gulp.task('coffee');
    gulp.src('./public/js/*.js')
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest('./public/min/'))
      .pipe(livereload());
  gulp.task('scss');
  	gulp.src('./public/css/*.css')
  		.pipe(concat('styles.css'))
      .pipe(gulp.dest('./public/min/'))
  		.pipe(livereload());
});
 
gulp.task('imagemin',function(){
	 gulp.src('./img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img/'));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('./src/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));
  return spriteData.pipe(gulp.dest('./public/img/'));
});
 
/*
 * Создадим веб-сервер, чтобы работать с проектом через браузер
 */
 gulp.task('server', function() {
    connect()
    	.use(require('connect-livereload')())
    	.use(serveStatic(__dirname + '/public'))
      .listen('3333');

    console.log('Сервер работает по адресу http://localhost:3333');
});
 
 /*
  * Создадим задачу, смотрящую за изменениями
  */
 gulp.task('watch', function(){
      livereload.listen();
  		gulp.watch('./sass/*.scss',['sass']);
    	gulp.watch('./*.haml',['haml']);
      gulp.watch(['./coffee/*.coffee'],['coffee']);
   		gulp.watch(['./public/js/*.js','./public/css/*.css'],['concat']);
      gulp.watch('./public/css/*.css',['prefix']);

    	gulp.watch('./img/**/*',['imagemin']);
  	  gulp.start('server');
  });
 
 gulp.task('default',['watch','sass','coffee','haml','prefix','concat','imagemin','sprite']);
