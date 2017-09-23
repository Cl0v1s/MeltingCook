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
            if(localStorage.getItem("cities") != null)
            {
                tag.setCities(JSON.parse(localStorage.getItem("cities")));
            }
            else
                tag.retrieveCities();
        });

        tag.retrieveCities = function()
        {
            if(tag.opts.valuefield == null)
                tag.opts.valuefield = "geolocation";
            var retrieve = App.request("/static/JS/cities.json");
            retrieve.then(function(response)
            {
                tag.setCities(response.cities);
            });
            retrieve.catch(function(error)
            {
                        ErrorHandler.alertIfError(error);

            });
        }

        tag.setCities = function(data)
        {
            var control = $('#city', tag.root).selectize({
                persist: false,
                maxItems: 1,
                valueField: [tag.opts.valuefield],
                labelField: 'name',
                searchField: ['name'],
                options: data,
                onChange : function(value) {
                    tag.value = value;
                }
            });
            localStorage.setItem("cities", JSON.stringify(data));
        }
    </script>
</app-placeinput>