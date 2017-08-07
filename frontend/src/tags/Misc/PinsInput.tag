<app-pinsinput>
    <input type="text" ref="pins" name="pins" id="pins" placeholder="Mes plus" value={ opts.pins }>


    <script>
        var tag = this;
        tag.value = "";

         tag.on("mount", function()
        {
            tag.retrieve();
        });

        tag.setValue = function(value)
        {
            tag.refs.pins.value = value;
            tag.value = value;
        }

        tag.retrieve = function()
        {
            // Récupération des pinses
            var retrievepins = App.request(App.Address + "/getpinses", null);
            retrievepins.then(function(response)
            {
                $('#pins').selectize({
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
            retrievepins.catch(function(error)
            {
                ErrorHandler.alertIfError(error);
            });
        }
    </script>
</app-pinsinput>