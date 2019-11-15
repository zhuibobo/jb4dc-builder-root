const $ = require("jQuery");

function createLinkTable() {
    var tableElem=$(`<table>
        <tbody>
        </tbody>
    </table>`);
    var tbodyElem=tableElem.find("tbody");

    tbodyElem.append("<tr><td><a href='001starter/default.html'>001starter</a></td></tr>");
    tbodyElem.append("<tr><td><a href='002starter/default.html'>002starter</a></td></tr>");
    tbodyElem.append("<tr><td><a href='003starter/default.html'>003starter</a></td></tr>");
    tbodyElem.append("<tr><td><a href='004colors/default.html'>004colors</a></td></tr>");
    tbodyElem.append("<tr><td><a href='005interaction/default.html'>005interaction</a></td></tr>")
    tbodyElem.append("<tr><td><a href='006overlays/default.html'>006overlays</a></td></tr>")
    tbodyElem.append("<tr><td><a href='007url-viewer/default.html'>007url-viewer</a></td></tr>")
    tbodyElem.append("<tr><td><a href='008modeler/default.html'>008modeler</a></td></tr>")
    tbodyElem.append("<tr><td><a href='009commenting/default.html'>009commenting</a></td></tr>")
    tbodyElem.append("<tr><td><a href='010bpmn-properties/default.html'>010bpmn-properties</a></td></tr>")

    $(window.document.body).append(tableElem);
}

createLinkTable();