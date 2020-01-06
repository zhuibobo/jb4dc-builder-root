// 操作 DOM 元素，把 content 显示到网页上
const jquery1 = require("jquery1");

function show(content) {
    //alert(1);
    //debugger;
    jquery1('#app').html('Hello,' + content);
}

// 通过 CommonJS 规范导出 show 函数
module.exports = show;