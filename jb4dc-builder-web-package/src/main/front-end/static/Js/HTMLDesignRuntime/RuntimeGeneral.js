var RuntimeGeneralInstance= {
    LoadHtmlDesignContent: function (url, appendToElemId, params, callback, sender) {
        jQuery.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: params
        }).done(function (result) {
            //console.log(result);
            callback.call(sender, result);
            //console.log(responseText);
            //$(appendToElemId).html(responseText)
            // Save response for use in complete callback
            //response = arguments;

            //self.html( selector ?

            // If a selector was specified, locate the right elements in a dummy div
            // Exclude scripts to avoid IE 'Permission Denied' errors
            //jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

            // Otherwise use the full result
            //responseText );

            // If the request succeeds, this function gets "data", "status", "jqXHR"
            // but they are ignored because response was set above.
            // If it fails, this function gets "jqXHR", "status", "error"
        }).always(callback && function (jqXHR, status) {
            /*self.each( function() {
                callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
            } );*/
        });
    }
}