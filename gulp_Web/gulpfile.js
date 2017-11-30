
var gulp = require('gulp'),
	del = require('del'),
	less = require('gulp-less'),
	minifycss = require('gulp-minify-css'),//css压缩
	rename = require('gulp-rename'),//文件重命名
	concat = require('gulp-concat'),//合并文件
	livereload = require('gulp-livereload'),//实现浏览器自动刷新页面
	autoprefixer = require('gulp-autoprefixer'),//自动处理浏览器前缀
	includer = require('gulp-content-includer'),//html文件拼接
	imgMin = require('gulp-imagemin'),//图片压缩
	uglify = require('gulp-uglify'),//js压缩
	notify = require('gulp-notify'),//当发生异常时提醒错误
	plumber = require('gulp-plumber');//less异常提醒

//文件基本路径
var path = {
		js : ['src/js/**/*.*'],
		less : ['src/less/*.less'],
		img : ['src/image/*.*'],
		html : ['src/view/**/*.html'],
		lib: {
			css : ['src/js/**/*.css']
		}
	};

//clean文件
gulp.task('clean',function(cb){
	del([
		'src/css/*',
		'src/js/**',
		'src/image/*',
		'src/*.html'
		],cb);
});

//js压缩合并及重命名
gulp.task('js',function(){
	gulp.src(path.js) //可选择合并的js
	.pipe(uglify())
	.pipe(rename({suffix:'min'}))
	.pipe(gulp.dest('src/js'));
	gulp.src(path.lib.css)
	.pipe(gulp.dest('src/dist/js'));

});

// less to css 及压缩和合并重命名
gulp.task('css',function(){
	gulp.src(path.less)
	.pipe(plumber({errorHandler:notify.onError('Error:<%= error.message %>')}))
	.pipe(less())
	.pipe(autoprefixer({
		borwsers : ['last 2 versions','Android >= 4.0'],
		remove : true
	}))
	.pipe(gulp.dest('src/css'))
	.pipe(minifycss())
	.pipe(concat('style.css'))
	.pipe(rename({suffix:'.min'}))
	.pipe(gulp.dest('src/css'));
	// .pipe(notify({message:'cssWorking task ok'}));
});

// img图片转换压缩
gulp.task('img',function(){
	gulp.src(path.img)
	.pipe(imgMin({progressive : true}))
	.pipe(gulp.dest('src/img'));
})

//定义html任务
gulp.task('html',function(){
	gulp.src(path.html)
	.pipe(includer({
		includerReg : /<!\-\-include\s+"([^"]+)"\-\->/g,
		deepConcat : true
	}))
	.pipe(gulp.dest('src/'));
})

// 监听文件的变化
gulp.task('watch',['css','img','html'],function(){
	//监听文件的变化并自动刷新页面
	gulp.watch(path.less,['css']);
	gulp.watch(path.js,['js']);
	gulp.watch(path.img,['img']);
	gulp.watch(path.html,['html']);

	livereload.listen();
	gulp.watch('src/*').on('change',livereload.changed);
})

gulp.task('default',['clean','watch']);
gulp.task('default',['watch']);