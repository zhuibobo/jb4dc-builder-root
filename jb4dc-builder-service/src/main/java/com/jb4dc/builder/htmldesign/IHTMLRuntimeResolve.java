package com.jb4dc.builder.htmldesign;


import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

public interface IHTMLRuntimeResolve {
    String resolveSourceHTML(JB4DCSession jb4DSession, String id, String htmlSource) throws JBuild4DCGenerallyException;

    //Element lastParentJbuild4dCustomElem=null;
    //void loopResolveElem(JB4DCSession jb4DSession, Document doc, Element parentElem, String sourceHTML, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo) throws JBuild4DGenerallyException;

    String dynamicBind(JB4DCSession jb4DSession, String id, String resolveHtml);
}
