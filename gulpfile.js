var gulp = require("gulp");
var partial = require("gulp-html-partial");

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
gulp.task("watch", function() {
    gulp.watch(
        "templates/**/*.html",
        { ignoreInitial: false },
        gulp.series(["compile-popup-partials", "compile-options-partials"])
    );
});
