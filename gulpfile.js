var gulp = require("gulp");
var partial = require("gulp-html-partial");
var sass = require("gulp-sass");
var clean = require("gulp-clean");

gulp.task("compile-scss", function() {
    return gulp
        .src("scss/tiddlybench.scss")
        .pipe(sass({ outputStyle: "compressed" }))
        .pipe(gulp.dest("distribution/css/"));
});

gulp.task("remove-compiled-html", () => {
    return gulp
        .src(
            [
                "./distribution/options/options.html",
                "./distribution/popup/popup.html",
                "./distribution/tabs/tabs.html",
                "./distribution/tiddlerpicker/tiddlerpicker.html",
            ],
            { allowEmpty: true }
        )
        .pipe(clean());
});

// compile the popup partials into one html file
gulp.task("compile-popup-partials", function() {
    return gulp
        .src("./templates/popup/popup.html")
        .pipe(partial({ basePath: "./templates/popup/partials/" }))
        .pipe(gulp.dest("./distribution/popup/"));
});

gulp.task("compile-options-partials", function() {
    return gulp
        .src("./templates/options/options.html")
        .pipe(partial({ basePath: "./templates/options/partials/" }))
        .pipe(gulp.dest("./distribution/options/"));
});

gulp.task("compile-tabs-partials", function() {
    return gulp
        .src("./templates/tabs/tabs.html")
        .pipe(partial({ basePath: "./templates/tabs/partials/" }))
        .pipe(gulp.dest("./distribution/tabs/"));
});

gulp.task("compile-tiddlerpicker-partials", function() {
    return gulp
        .src("./templates/tiddlerpicker/tiddlerpicker.html")
        .pipe(partial({ basePath: "./templates/tiddlerpicker/partials/" }))
        .pipe(gulp.dest("./distribution/tiddlerpicker/"));
});
gulp.task(
    "compile-all",
    gulp.series([
        "remove-compiled-html",
        "compile-popup-partials",
        "compile-options-partials",
        "compile-tabs-partials",
        "compile-tiddlerpicker-partials",
        "compile-scss",
    ])
);
gulp.task("watch", function() {
    gulp.watch(
        "templates/**/*.html",
        { ignoreInitial: false },
        gulp.series([
            "remove-compiled-html",
            "compile-popup-partials",
            "compile-options-partials",
            "compile-tabs-partials",
            "compile-tiddlerpicker-partials",
        ])
    );
    gulp.watch(
        "scss/**/*.scss",
        { ignoreInitial: false },
        gulp.series(["compile-scss"])
    );
});
