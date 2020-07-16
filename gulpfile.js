const gulp = require("gulp")
const browserSync = require("browser-sync").create()
const scss = require("gulp-sass")
const autoprefixer = require("gulp-autoprefixer")
const rename = require("gulp-rename")
const cleanCSS = require("gulp-clean-css")
const babel = require("gulp-babel")
const contact = require("gulp-concat")
const uglify = require("gulp-uglify")
const gcmq = require("gulp-group-css-media-queries")
const imagemin = require("gulp-imagemin")
const zip = require('gulp-zip')

const dist = "./dist/"
const src = "./src/"

gulp.task("browser-sync", function () {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  })
})

gulp.task("scss", function () {
  return gulp.src(src + "scss/style.scss")
    .pipe(scss().on("error", scss.logError))
    .pipe(gulp.dest(dist + "css"))
    .pipe(autoprefixer({
      cascade: false,
      overrideBrowserslist: ["last 15 versions"],
    }))
    .pipe(gulp.dest(dist + "css"))
    .pipe(gcmq())
    .pipe(gulp.dest(dist + "css"))
    .pipe(rename({
      extname: ".min.css"
    }))
    .pipe(gulp.dest(dist + "css"))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(dist + "css"))
})

gulp.task("libsCss", function () {
  return gulp.src(["node_modules/normalize.css/normalize.css"])
    .pipe(contact("_libs.scss"))
    .pipe(gulp.dest(src + "/scss"))
})

gulp.task("js", function () {
  return gulp.src(src + "js/**/*.js")
    .pipe(babel({
      presets: ["@babel/env"]
    }))
    .pipe(gulp.dest(dist + "/js"))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task("libsJs", function () {
  return gulp.src(["node_modules/jquery/dist/jquery.js"])
    .pipe(contact("libs.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(dist + "/js"))
})

gulp.task("html", function () {
  return gulp.src(src + "**/*.html")
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task("img", function () {
  return gulp.src(src + "img/**/*.{png,jpg,svg,gif,ico,webp}")
    .pipe(imagemin())
    .pipe(gulp.dest(dist + 'img'))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task("fonts", function () {
  return gulp.src(src + "fonts/**/*.{ttf,wof, wof2}")
    .pipe(gulp.dest(dist + "fonts"))
})

gulp.task("build", function () {
  return gulp.src(dist + "**")
    .pipe(zip('project.zip'))
    .pipe(gulp.dest('./'))
})

gulp.task("watch", function () {
  gulp.watch(src + "scss/style.scss", gulp.parallel("scss"))
  gulp.watch(dist + "css/*.css").on('change', browserSync.reload);
  gulp.watch(src + "js/main.js", gulp.parallel("js"))
  gulp.watch(src + "**/*.html", gulp.parallel("html"))
  gulp.watch(src + "img/**/*.{png,jpg,svg,gif,ico,webp}", gulp.parallel("img"))
  gulp.watch(src + "fonts/**/*.{ttf,wof, wof2}", gulp.parallel("fonts"))
})

gulp.task("default", gulp.parallel("libsJs", "libsCss", "scss", "js", "html", "img", "watch", "browser-sync"))

