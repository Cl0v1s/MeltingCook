<app-placeinput>
    <input type="text" ref="city" name="city" id="city" placeholder="Lieu de partage" value='{ opts.place }'>
    <script>
        var tag = this;
        tag.value = "";

        tag.on("before-mount", function()
        {
            if(tag.opts.place != null) {
                tag.value = tag.opts.place;
            }
        });


        tag.on("mount", function()
        {
            tag.retrieveCities();
        });

        tag.retrieveCities = function()
        {
            if(tag.opts.valuefield == null)
                tag.opts.valuefield = "geolocation";
            var retrieve = App.request("/static/JS/cities.json");
            retrieve.then(function(response)
            {
                var control = $('#city', tag.root).selectize({
                    persist: false,
                    maxItems: 1,
                    valueField: [tag.opts.valuefield],
                    labelField: 'name',
                    searchField: ['name'],
                    options: response.cities,
                    onChange : function(value) {
                        tag.value = value;
                    }
                });
            });
            retrieve.catch(function(error)
            {
                        ErrorHandler.alertIfError(error);

            });
        }
    </script>
</app-placeinput>