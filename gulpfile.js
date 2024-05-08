const gulp = require('gulp');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');

const path = {
    dist: './dist/',
    input: './lib/*.ts',
    output: 'renderer.js',
    main: './lib/renderer.ts',
    example: './example/**\/*.*',
    public: './public/**\/*.*',
};

var tsProject = ts.createProject({
    declaration: true
});

const cleanDist = () => {
    return gulp.src(path.dist, { read: false })
        .pipe(clean());
};

const compile = () => {
   return gulp.src(path.input).pipe(tsProject()).pipe(gulp.dest(path.dist));
};

const build = gulp.series(cleanDist, compile);

const watch = gulp.series(cleanDist, compile, function watch() {
    gulp.watch(path.input, gulp.series(compile));
});
 
exports.compile = compile;
exports.watch = watch;
exports.build = build;