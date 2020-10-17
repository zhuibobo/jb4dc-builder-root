var IssuesUtility={
    AutoSetNextIssuesCode:function (projectId,$toElem) {
        AjaxUtility.Post("",{},function (result) {
            var nextIssuesCode=result.data;

        });
    }
}
//alert(2);