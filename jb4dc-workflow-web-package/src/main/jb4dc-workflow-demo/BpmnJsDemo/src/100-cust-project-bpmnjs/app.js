import $ from 'jquery';

import BpmnModeler from 'bpmn-js';

import diagramXML from './empty.bpmn';


var modeler = new BpmnModeler({
    "container": $('#js-canvas')[0]
});

function openDiagram(xml) {
    modeler.importXML(xml, function (err) {
        console.log(err);
    });
}

function saveSVG(done) {
    modeler.saveSVG(done);
}

function saveDiagram(done) {
    modeler.saveXML({ format: true }, function(err, xml) {
        //done(err, xml);
        console.log(xml);
    });
}

$(function() {

    $('#js-create-diagram').click(function(e) {
        e.stopPropagation();
        e.preventDefault();

        createNewDiagram();
    });

    var downloadLink = $('#js-download-diagram');
    var downloadSvgLink = $('#js-download-svg');

    $('.buttons a').click(function(e) {
        if (!$(this).is('.active')) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    function setEncoded(link, name, data) {
        var encodedData = encodeURIComponent(data);

        if (data) {
            link.addClass('active').attr({
                'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
                'download': name
            });
        } else {
            link.removeClass('active');
        }
    }

    var exportArtifacts = debounce(function() {

        saveSVG(function(err, svg) {
            setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
        });

        saveDiagram(function(err, xml) {
            setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
        });
    }, 500);

    modeler.on('commandStack.changed', exportArtifacts);

    openDiagram(diagramXML);
});



// helpers //////////////////////

function debounce(fn, timeout) {

    var timer;

    return function() {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(fn, timeout);
    };
}