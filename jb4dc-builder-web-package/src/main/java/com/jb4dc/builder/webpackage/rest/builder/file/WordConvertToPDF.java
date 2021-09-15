package com.jb4dc.builder.webpackage.rest.builder.file;

import com.aspose.words.Document;
import com.aspose.words.SaveFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(value = "/Rest/Builder/WordConvertToPDF")
public class WordConvertToPDF extends FileRest {

    @RequestMapping(value = "/TestDocToPDF")
    void testDocToPDF(HttpServletRequest request, HttpServletResponse response) throws Exception {
        //com.aspose.words.License license = new com.aspose.words.License();
        //license.setLicense("aspose-word-license.xml");

        Document wpd = new Document("D:\\文档资料\\100M.doc");

        // convert doc to docx, PDF and HTML

        //wpd.save("D:\\文档资料\\output.docx", SaveFormat.DOCX);

        wpd.save("D:\\文档资料\\100M.pdf", SaveFormat.PDF);

        //wpd.save("D:\\文档资料\\1M.html", SaveFormat.HTML);
    }
}
