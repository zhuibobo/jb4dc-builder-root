'use strict';

require("@babel/polyfill");
const babel = require('gulp-babel');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlclean = require('gulp-htmlclean');
const less = require('gulp-less');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');

const replacecust = require("./gulp-plugin/gulp-replace-cust/index.js");

const replaceBlockObj=require("./replaceBlock.js");

const sourcePath = "static";
const distPath = "../resources/static";
let isdebug=false;

/*编译Vue的扩展插件*/
gulp.task('js-vue-ex-component',()=>{
    var obj = gulp.src([sourcePath + '/Js/VueComponent/**/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init())
        //.pipe(sourcemaps.identityMap())
        .pipe(concat('GridVueEXComponent.js'))
        //.pipe(uglify())

    if(!isdebug){
        obj=obj.pipe(uglify());
    }

    return  obj.pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath + "/Js"));
});

gulp.task('js-utility-component',()=>{
    var obj = gulp.src([sourcePath + '/Js/Utility/**/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init())
        //.pipe(sourcemaps.identityMap())
        .pipe(concat('GridUtility.js'))
    //.pipe(uglify())

    if(!isdebug){
        obj=obj.pipe(uglify());
    }

    return  obj.pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath + "/Js"));
});

gulp.task('html-only',()=>{
    return copyAndResolveHtml(sourcePath + "/HTML/**/*.html",sourcePath + "/HTML",distPath + "/HTML");
});

/*编译表单设计器插件的相关Less文件*/
gulp.task('grid-system-less',()=>{
    return gulp.src(sourcePath+"/Themes/Default/Grid/Css/*.less")
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(sourcemaps.write())
        .pipe(concat('JBuild4DCGridSystem.css'))
        .pipe(gulp.dest(distPath+'/Themes/Default/Grid/Css'));
});

gulp.task('dist-watch', function() {
    isdebug=false;
    gulp.watch(sourcePath+"/HTML/**/*", gulp.series('html-only'));
    gulp.watch(sourcePath + "/Js/VueComponent/**/*.js", gulp.series('js-vue-ex-component'));
});

gulp.task('dist-watch-debug', function() {
    isdebug=true;
    gulp.watch(sourcePath+"/HTML/**/*", gulp.series('html-only'));
    gulp.watch(sourcePath + "/Js/VueComponent/**/*.js", gulp.series('js-vue-ex-component'));
    gulp.watch(sourcePath + "/Js/Utility/**/*.js", gulp.series('js-utility-component'));
    gulp.watch(sourcePath+"/Themes/Default/Grid/**/*.less", gulp.series('grid-system-less'));
});
//endregion

function copyAndResolveHtml(sourcePath,base,toPath) {
    /*拷贝HTML文件*/
    var obj=gulp.src(sourcePath, {base: base})
        .pipe(replacecust(replaceBlockObj.replaceBlock('GeneralLib'), replaceBlockObj.replaceGeneralLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('TurfLib'), replaceBlockObj.replaceTurfLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('CodeMirrorLib'), replaceBlockObj.replaceCodeMirrorLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('FormDesignLib'), replaceBlockObj.replaceFormDesignLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('JBuild4DFormDesignLib'), replaceBlockObj.replaceJBuild4DFormDesignLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('ZTreeExtendLib'), replaceBlockObj.replaceZTreeExtendLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('ThemesLib'), replaceBlockObj.replaceThemesLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('BootStrap4Lib'), replaceBlockObj.replaceBootStrap4Lib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('FrameV1Lib'), replaceBlockObj.replaceFrameV1Lib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('GoJsLib'), replaceBlockObj.replaceGoJsLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('Webix'), replaceBlockObj.replaceWebixLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('HTMLDesignRuntimeLib'), replaceBlockObj.replaceHTMLDesignRuntimeLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('HTMLDesignWysiwygLib'), replaceBlockObj.replaceHTMLDesignWysiwygLib))

    if(isdebug){
        obj=obj.pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS:true,
            minifyJS:false,
            removeComments:false
        }));
    }
    else{
        obj=obj.pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS:true,
            minifyJS:true,
            removeComments:true
        }));
    }
    return obj.pipe(gulp.dest(toPath));
}