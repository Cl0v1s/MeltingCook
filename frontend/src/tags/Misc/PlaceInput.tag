<app-placeinput>
    <input type="text" ref="city" name="city" id="city" placeholder="Lieu de partage" value={ opts.place }>
    <script>
        var tag = this;
        tag.value = "";

        tag.on("mount", function()
        {
            tag.retrieveCities();
        });

        tag.getPlaceName = function()
        {
            return tag.refs.city.value;
        };

        tag.retrieveCities = function()
        {
            var retrieve = App.request("/static/JS/cities.json");
            retrieve.then(function(response)
            {
                console.log(response.cities);
                $('#city').selectize({
                    persist: false,
                    maxItems: 1,
                    valueField: ['geolocation'],
                    labelField: 'name',
                    searchField: ['name'],
                    options: response.cities,
                    onChange : function(value)
                    {
                        tag.value = value;
                    },
                });
            });
            retrieve.catch(function(error)
            {
                        ErrorHandler.alertIfError(error);

            });
        }
    </script>
</app-placeinput>