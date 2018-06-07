/*
*       Tareas principales:
*       gulp (default)      Crea la compilación para desarrollo (sin minificar y un servidor)
*       gulp grupo          Igual que la tarea anterior, solo que no minifica ni ofusca archivos
*       gulp optimizado     Archivos optimizados para un servidor apache, por ejemplo desarrollotp.com. El archivo htpasswd pedirá acceso.
*
*/
var gulp                    = require('gulp'),
    pug                     = require('gulp-pug'),
    gulpCopy                = require('gulp-copy'),
    sass                    = require('gulp-sass'),
    concat                  = require('gulp-concat'),
    uglifyjs                = require('uglify-es'),
    composer                = require('gulp-uglify/composer'),
    pump                    = require('pump'),
    cssnano                 = require('gulp-cssnano'),
    imagemin                = require('gulp-imagemin'),
    autoprefixer            = require('gulp-autoprefixer'),
    sourcemaps              = require('gulp-sourcemaps'),
    browserSync             = require('browser-sync').create(),
    del                     = require('del'),
    data                    = require('gulp-data'),
    fs                      = require('fs'),
    cache                   = require('gulp-cache'),
    javascriptObfuscator    = require('gulp-javascript-obfuscator'),
    secuencial              = require('run-sequence'),
    rename                  = require('gulp-rename'),
    reemplazo               = require('replace-in-file'),
    criticalCss             = require('gulp-penthouse'),
    merge                   = require('merge-stream'),
    esProduccion            = false,
    minify                  = composer(uglifyjs, console),
    javascript = [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/materialize-css/js/initial.js',
        'node_modules/materialize-css/js/jquery.easing.1.4.js',
        'node_modules/materialize-css/js/animation.js',
        'node_modules/materialize-css/js/velocity.min.js',
        'node_modules/materialize-css/js/hammer.min.js',
        'node_modules/materialize-css/js/jquery.hammer.js',
        'node_modules/materialize-css/js/global.js',
        'node_modules/materialize-css/js/collapsible.js',
        'node_modules/materialize-css/js/dropdown.js',
        'node_modules/materialize-css/js/sideNav.js',
        'node_modules/materialize-css/js/slider.js',
        'node_modules/materialize-css/js/waves.js',
        'node_modules/materialize-css/js/forms.js',
        'node_modules/jquery-validation/dist/jquery.validate.js',
        'node_modules/materialize-css/js/modal.js',
        'app/js/funciones.js'
    ];
/*
* Tareas generales
* */

// Copia de archivos extras, como el robots o sitemap
gulp.task('copyExtraFiles', function(){
    var copiar = gulp
                    .src(['./app/resources/*'])
                    .pipe(gulpCopy('dist', { prefix: 1 }));

    var raiz = !esProduccion ? gulp.src(['./app/resources/root/*', './app/resources/root/.*']).pipe(gulpCopy('dist', { prefix: 3 })) : gulp.src(['./app/resources/root/*']).pipe(gulpCopy('dist', { prefix: 3 })) ;
    
    return merge(copiar, raiz);
});

//Elimina la carpeta dist
gulp.task('limpiar', function(){
    console.log('Limpiando la carpeta');
    return del.sync('./dist');
});

//Optimiza las imagenes
gulp.task('optimizarimagenes', function () {
    gulp.src('app/imagenes/**/*')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/imagenes'))
});

//Copia las fuentes a la carpeta fonts
gulp.task('fuentes', function() {
    return gulp.src('app/fuentes/**/*')
        .pipe(gulp.dest('dist/fuentes'))
});

//Mensajes de errores
function manejoErrores (error) {
    console.log('\x1b[31m%s\x1b[0m', '-------------');
    console.log('\x1b[45m%s\x1b[0m', ' Error ʕ•ᴥ•ʔ ');
    console.log(error.toString());
    console.log('\x1b[31m%s\x1b[0m', '-------------');
    this.emit('end')
}

/*
* Servidor de desarrollo
* */

//Creamos el servidor que contrala las demas tareas
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir : "./dist",
            serveStaticOptions: {
                extensions: ["html"]
            }
        }
    });

    gulp.watch("app/js/**/*.js",        ['javascript-desarrollo']).on('change', browserSync.reload);
    gulp.watch("app/scss/**/*.scss",    ['sass-desarrollo']);
    gulp.watch("app/imagenes/**/*",     ['optimizarimagenes']);
    gulp.watch("app/**/*.pug",          ['pug-desarrollo']);
    gulp.watch("app/resources/**/*",    ['copyExtraFiles']);
});

//Compilacion de css
gulp.task('sass-desarrollo', function() {
    return gulp.src([
        "app/scss/*.scss"
    ])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass().on('error', manejoErrores))
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

//Compilacion de javascript
gulp.task('javascript-desarrollo', function (cb) {
    pump([
            gulp.src(javascript),
            concat('scripts.js'),
            gulp.dest('dist/js')
        ],
        cb
    );
});

//Compilacion de html
gulp.task('pug-desarrollo', function buildHTML() {
    return gulp.src('app/secciones/**/*.pug')
        .pipe(pug({
            data : {
                ambientetrabajado : esProduccion
            },
            pretty : true
        }))
        .on('error', manejoErrores)
        .pipe(gulp.dest('dist'));
        //.pipe(browserSync.stream({once: true}));
});



//Llamado a la tarea (por default: gulp)
gulp.task('default', function(){
    secuencial('limpiar', ['sass-desarrollo', 'javascript-desarrollo', 'optimizarimagenes', 'fuentes', 'copyExtraFiles'], 'pug-desarrollo', 'serve');
});





/*
* Servidor de producción
* */

gulp.task('sass-produccion', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(cssnano())
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: false
        }))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});
gulp.task('javascript-produccion', function (cb) {
    var opcionescirijillas = {
            compress: false
        };

    pump([
            gulp.src(javascript),
            concat('scripts.js'),
            minify(opcionescirijillas),
            javascriptObfuscator(),
            gulp.dest('dist/js')
        ],
        cb
    );
});
gulp.task('pug-produccion', function buildHTML() {
    return gulp.src('app/secciones/**/*.pug')
        .pipe(pug({
            data : {
                ambientetrabajado : esProduccion
            }
        }))
        .pipe(rename({
            extname: ".jsp"
        }))
        .pipe(gulp.dest('dist'));
});
gulp.task('serve-produccion', function() {
    browserSync.init({
        server: {
            baseDir : "./dist",
            serveStaticOptions: {
                extensions: ["html"]
            }
        }
    });
});



gulp.task('pug-optimizado-masclicks', function buildHTML() {
    return gulp.src('app/secciones/**/*.pug')
        .pipe(pug({
            data : {
                ambientetrabajado : esProduccion
            }
        }))
        .pipe(gulp.dest('dist'));
});






/*
* Tareas de producción con minificación de archivos (para desarrollotp)
* */
gulp.task('optimizado', function(){
    secuencial('limpiar', ['sass-produccion', 'javascript-produccion', 'optimizarimagenes', 'fuentes', 'copyExtraFiles'], 'pug-optimizado-masclicks');
});




/*
* Tareas sin minificación
* */
gulp.task('sass-grupo', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: true
        }))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});
gulp.task('javascript-grupo', function (cb) {
    var opcionescirijillas = {
            compress: false
        };

    pump([
            gulp.src(javascript),
            concat('scripts.js'),
            gulp.dest('dist/js')
        ],
        cb
    );
});
gulp.task('pug-grupo', function buildHTML() {
    return gulp.src('app/secciones/**/*.pug')
        .pipe(pug({
            data : {
                ambientetrabajado : esProduccion
            },
            pretty : true
        }))
        .pipe(rename({
            extname: ".jsp"
        }))
        .pipe(gulp.dest('dist'));
});

// gulp grupo (tareas sin minificar archivos)
gulp.task('grupo', function(){
    secuencial('limpiar', ['sass-grupo', 'javascript-grupo', 'optimizarimagenes', 'fuentes', 'copyExtraFiles'], 'pug-grupo');
});