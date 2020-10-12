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
    var obj= gulp.src([sourcePath + '/Js/VueComponent/**/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init())
        //.pipe(sourcemaps.identityMap())
        .pipe(concat('BuilderVueEXComponent.js'))

    if(!isdebug){
        obj=obj.pipe(uglify());
    }

    return  obj
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath + "/Js"));
});

/*编译Js下旧的UI的组件*/
gulp.task('js-ui-component',()=>{
    var obj= gulp.src([sourcePath + '/Js/EditTable/**/*.js',sourcePath + '/Js/TreeTable/**/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('UIEXComponentForBuilder.js'))

    if(!isdebug){
        obj=obj.pipe(uglify());
    }

    return  obj
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath + "/Js"));
});


/*HTML设计的基础的工具类*/
gulp.task('html-design-utility',()=> {
    var obj= gulp.src([
        sourcePath + "/Js/HTMLDesign/*.js"
    ])
        .pipe(babel())
        .pipe(sourcemaps.init())
        .pipe(concat('HTMLDesignUtility.js'))

    if(!isdebug){
        obj=obj.pipe(uglify());
    }

    return  obj
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
gulp.task('html-design-plugins-js',()=> {
    var obj = gulp.src([
        sourcePath + "/Js/HTMLDesign/**/Plugins/**/*.js"
    ], {base: sourcePath + "/Js/HTMLDesign/**/Plugins"})
        .pipe(babel({
            presets: ['@babel/env']
        }))

    if (!isdebug) {
        obj = obj.pipe(uglify());
    }
    return obj.pipe(gulp.dest(distPath + "/Js/HTMLDesign/**/Plugins"));
});
gulp.task('html-design-plugins-css-img',()=>{
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
const html_design_runtime_distPath = "../../../../jb4dc-builder-client/src/main/resources/static";
gulp.task('html-design-runtime-full-js',()=>{
    var obj= gulp.src([sourcePath + '/Js/HTMLDesignRuntime/**/*.js','!'+sourcePath + '/Js/HTMLDesignRuntime/**/WFDCT_CKEditor4_*_Config.js'])
        .pipe(babel({
            presets: ['@babel/env'],
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('HTMLDesignRuntimeFull.js'));

    if(!isdebug){
        obj=obj.pipe(uglify());
    }
        /*.pipe(uglify(
            {
                compress: {drop_debugger: false}
            }
        ))*/
    return  obj.pipe(sourcemaps.write())
        .pipe(gulp.dest(html_design_runtime_distPath + "/Js"));
});
gulp.task('html-design-runtime-wfdct-ckeditor4-config-js',()=>{
    var obj= gulp.src([sourcePath + '/Js/HTMLDesignRuntime/**/WFDCT_CKEditor4_Def_Config.js'])
        .pipe(babel({
            presets: ['@babel/env'],
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('WFDCT_CKEditor4_Def_Config.js'));

    if(!isdebug){
        obj=obj.pipe(uglify());
    }
    /*.pipe(uglify(
        {
            compress: {drop_debugger: false}
        }
    ))*/
    return  obj.pipe(sourcemaps.write())
        .pipe(gulp.dest(html_design_runtime_distPath + "/Js"));
});


gulp.task('html-design-runtime-template',()=>{
    return copyAndResolveHtml(sourcePath + "/HTML/Builder/Runtime/**/*.html",sourcePath + "/HTML",html_design_runtime_distPath + "/HTML");
});

/*SiteTemplate设计的基础工具类*/
gulp.task('site-template-design-utility',()=> {
    var obj= gulp.src([
        sourcePath + "/Js/SiteTemplateDesign/*.js"
    ])
        .pipe(babel())
        .pipe(sourcemaps.init())
        .pipe(concat('SiteTemplateDesignUtility.js'))

    if(!isdebug){
        obj=obj.pipe(uglify());
    }

    return  obj
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath + "/Js/SiteTemplateDesign"));
});

/*编译Themes下的Less文件*/
gulp.task('html-design-runtime-less',()=>{
    return gulp.src(sourcePath+"/Themes/Default/Css/*.less")
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPath+'/Themes/Default/Css'))
        .pipe(gulp.dest(html_design_runtime_distPath+'/Themes/Default/Css'));
});

gulp.task('html-design-runtime-images-builder-runtime',()=>{
    return gulp.src(sourcePath+"/Themes/Default/Less/Images/BuilderRuntime/*", {base:sourcePath+"/Themes/Default/Less/Images/BuilderRuntime"}).pipe(gulp.dest(html_design_runtime_distPath+"/Themes/Default/Css/Images/BuilderRuntime"));
});

gulp.task('html-design-all', gulp.series('html-design-utility','html-design-ckeditor-config','html-design-plugins-js','html-design-plugins-css-img','html-design-plugins-html','html-design-runtime-full-js','html-design-runtime-less','html-design-runtime-template','html-design-runtime-wfdct-ckeditor4-config-js','html-design-runtime-images-builder-runtime'));

gulp.task('html-template-web-builder-package',()=>{
    //gulp.src(jarFromResourcePath+"/HTML/**/*", {base:jarFromResourcePath+"/HTML"}).pipe(gulp.dest(jarToResourcePath+"/HTML"))
    return copyAndResolveHtml(sourcePath + "/HTML/Builder/!(Runtime)/**/*.html",sourcePath + "/HTML",distPath + "/HTML");
    /*return gulp.src(jarFromResourcePath+"/HTML/!**!/!*.html", {base:jarFromResourcePath+"/HTML"}).pipe(htmlmin({
        collapseWhitespace: true,
        minifyCSS:true,
        minifyJS:false,
        removeComments:true
    })).pipe(gulp.dest(jarToResourcePath+"/HTML"));*/
});

gulp.task('html-template-web-system-setting-package',()=>{
    return copyAndResolveHtml(sourcePath + "/HTML/SystemSetting/!(Runtime)/**/*.html",sourcePath + "/HTML",distPath + "/HTML");
});

gulp.task('site-template-design-all', gulp.series('site-template-design-utility'));

gulp.task('all', gulp.series('html-design-all','html-template-web-builder-package','html-template-web-system-setting-package','js-vue-ex-component','js-ui-component','site-template-design-all'));

/*gulp.task('all-debug',done =>{
     var isdebug=true;
     gulp.series('all');
     done();
});*/

gulp.task('dist-watch', function() {
    //gulp.watch(sourcePath+"/HTML/**/*", gulp.series('html-only'));
    //gulp.watch(sourcePath + "/Js/VueComponent/**/*.js", gulp.series('js-vue-ex-component'));
    //var isdebug=false;
    gulp.watch(sourcePath+"/**/*", gulp.series('all'));
});

gulp.task('dist-watch-debug', function() {
    //gulp.watch(sourcePath+"/HTML/**/*", gulp.series('html-only'));
    //gulp.watch(sourcePath + "/Js/VueComponent/**/*.js", gulp.series('js-vue-ex-component'));
    isdebug=true;
    gulp.watch(sourcePath+"/**/*", gulp.series('all'));
});

//endregion

function copyAndResolveHtml(sourcePath,base,toPath) {
    /*拷贝HTML文件*/
    var obj=gulp.src(sourcePath, {base: base})
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
        .pipe(replacecust(replaceBlockObj.replaceBlock('HTMLDesignPluginLib'), replaceBlockObj.replaceHTMLDesignPluginLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('SiteTemplateDesignLib'), replaceBlockObj.replaceSiteTemplateDesignLib))

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

function copyAndResolveHtml1(sourcePath,base,toPath) {
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