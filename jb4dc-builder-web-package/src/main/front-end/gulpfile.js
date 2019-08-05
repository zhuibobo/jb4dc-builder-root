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

/*编译Vue的扩展插件*/
gulp.task('js-vue-ex-component',()=>{
    return gulp.src([sourcePath + '/Js/VueComponent/**/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init())
        //.pipe(sourcemaps.identityMap())
        .pipe(concat('SSOVueEXComponent.js'))
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath + "/Js"));
});

/*编译Js下旧的UI的组件*/
gulp.task('js-ui-component',()=>{
    return gulp.src([sourcePath + '/Js/EditTable/**/*.js',sourcePath + '/Js/TreeTable/**/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('UIEXComponentForBuilder.js'))
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath + "/Js"));
});


/*HTML设计的基础的工具类*/
gulp.task('html-design-utility',()=> {
    return gulp.src([
        sourcePath + "/Js/HTMLDesign/*.js"
    ])
        .pipe(babel())
        .pipe(sourcemaps.init())
        .pipe(concat('HTMLDesignUtility.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath + "/Js/HTMLDesign"));
});

/*CKEditor的配置文件*/
gulp.task('html-design-ckeditor-config',()=> {
    return gulp.src([
        sourcePath + "/Js/HTMLDesign/CKEditorConfig/*.js"
    ])
        .pipe(babel())
        .pipe(sourcemaps.init())
        .pipe(concat('CKEditorConfig.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath + "/Js/HTMLDesign/CKEditorConfig"));
});

/*WebForm相关的插件*/
gulp.task('html-design-plugins',()=>{
    return gulp.src([
        sourcePath + "/Js/HTMLDesign/**/Plugins/**/*.js",
        sourcePath + "/Js/HTMLDesign/**/Plugins/**/*.css",
        sourcePath + "/Js/HTMLDesign/**/Plugins/**/*.png"
    ], {base: sourcePath+"/Js/HTMLDesign/**/Plugins"}).
    pipe(gulp.dest(distPath + "/Js/HTMLDesign/**/Plugins"));
});

/*编译表单设计器插件的相关的HTML文件*/
gulp.task('html-design-plugins-html',()=>{
    return copyAndResolveHtml(sourcePath + "/Js/HTMLDesign/**/*.html",sourcePath + "/Js/HTMLDesign",distPath + "/Js/HTMLDesign");
});

/*编译表单设计器插件的相关Less文件*/
gulp.task('html-design-plugins-less',()=>{
    return gulp.src(sourcePath+"/Js/HTMLDesign/**/*.less")
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(sourcemaps.write())
        .pipe(concat('HTMLDesignWysiwygForPlugins.css'))
        .pipe(gulp.dest(distPath+'/Themes/Default/Css'));
});

/*表单设计器的运行时JS库*/
gulp.task('html-design-runtime-full-js',()=>{
    return gulp.src([sourcePath + '/Js/HTMLDesignRuntime/**/*.js'])
        .pipe(babel({
            presets: ['@babel/env'],
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('HTMLDesignRuntimeFull.js'))
        /*.pipe(uglify(
            {
                compress: {drop_debugger: false}
            }
        ))*/
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath + "/Js"));
});

/*编译Themes下的Less文件*/
gulp.task('less',()=>{
    return gulp.src(sourcePath+"/Themes/Default/Css/*.less")
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath+'/Themes/Default/Css'));
});

gulp.task('html-design-all', gulp.series('html-design-utility','html-design-ckeditor-config','html-design-plugins','html-design-plugins-html','html-design-runtime-full-js','less'));

gulp.task('html-only',()=>{
    //gulp.src(jarFromResourcePath+"/HTML/**/*", {base:jarFromResourcePath+"/HTML"}).pipe(gulp.dest(jarToResourcePath+"/HTML"))
    return copyAndResolveHtml(sourcePath + "/HTML/**/*.html",sourcePath + "/HTML",distPath + "/HTML");
    /*return gulp.src(jarFromResourcePath+"/HTML/!**!/!*.html", {base:jarFromResourcePath+"/HTML"}).pipe(htmlmin({
        collapseWhitespace: true,
        minifyCSS:true,
        minifyJS:false,
        removeComments:true
    })).pipe(gulp.dest(jarToResourcePath+"/HTML"));*/
});

gulp.task('dist-watch', function() {
    //gulp.watch(sourcePath+"/HTML/**/*", gulp.series('html-only'));
    //gulp.watch(sourcePath + "/Js/VueComponent/**/*.js", gulp.series('js-vue-ex-component'));
    gulp.watch(sourcePath+"/**/*", gulp.series('html-design-all','html-only','js-vue-ex-component','js-ui-component'));
});

//endregion

function copyAndResolveHtml(sourcePath,base,toPath) {
    /*拷贝HTML文件*/
    return gulp.src(sourcePath, {base: base})
        .pipe(replacecust(replaceBlockObj.replaceBlock('GeneralLib'), replaceBlockObj.replaceGeneralLib))
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
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS:true,
            minifyJS:false,
            removeComments:true
        }))
        /*.pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS:true,
            minifyJS:false
        }))*/
        //.pipe(htmlclean({
        //    protect: /<\!--%fooTemplate\b.*?%-->/g,
        //    edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
        //}))
        .pipe(gulp.dest(toPath));
}