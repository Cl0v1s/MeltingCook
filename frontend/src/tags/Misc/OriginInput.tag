<app-origininput>
    <input type="text" ref="origin" name="origin" id="origin" placeholder="Type de cuisine" value="{ opts.origin }">
    <script>
        var tag = this;
        tag.value = "";

         tag.on("mount", function()
        {
            tag.retrieve();
        });

        tag.setValue = function(value)
        {
            tag.refs.origin.value = value;
            tag.value = value;
        }

        tag.retrieve = function()
        {
            // Récupération des origines
            var retrieveOrigins = App.request(App.Address + "/getorigins", null);
            retrieveOrigins.then(function(response)
            {
                $('#origin').selectize({
                    delimiter: ";",
                    persist: false,
                    maxItems: null,
                    valueField: 'name',
                    labelField: 'name',
                    searchField: ['name'],
                    options: response.data,
                    onChange : function(value)
                    {
                        tag.value = value;
                    },
                    /*create: function (input) {
                        return {
                            name: input
                        };
                    },*/
                });
            });
            retrieveOrigins.catch(function(error)
            {
                        ErrorHandler.alertIfError(error);
            });
        }
    </script>
</app-origininput>