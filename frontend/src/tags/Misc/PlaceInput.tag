<app-placeinput>
    <select ref="city" name="city" id="city" placeholder="Lieu de partage" value='{ opts.place }'>
    <script>
        var tag = this;
        tag.data = null;
        tag.value = "";

        tag.on("before-mount", function()
        {
            if(tag.opts.place != null) {
                tag.value = decodeURIComponent(tag.opts.place);
            }
            if(tag.opts.valuefield == null)
                tag.opts.valuefield = "geolocation";
        });


        tag.on("mount", function()
        {
            try{
                let data = JSON.parse(localStorage.getItem("cities"));
                if(data == null)
                {
                    tag.retrieveCities();
                    return;
                }
                tag.setCities(data);
            }
            catch (e) {
                tag.retrieveCities();
            }
        });

        tag.retrieveCities = function()
        {
            console.log("Downloading Cities");
            var retrieve = App.request("/static/JS/cities.json");
            retrieve.then(function(response)
            {
                tag.setCities(response.cities);
            });
            retrieve.catch(function(error)
            {
                ErrorHandler.alertIfError(error);
            });
        };

        tag.setCities = function(data)
        {
            tag.data = data;
            let selectize = $('#city', tag.root).selectize({
                persist: false,
                maxItems: 1,
                valueField: "name",
                labelField: 'name',
                searchField: ['name'],
                options: data,
                onChange : function(value) {
                    tag.value = selectize.options[value];
                }
            })[0].selectize;
            selectize.setValue(tag.value);
            localStorage.setItem("cities", JSON.stringify(data));
        }
    </script>
</app-placeinput>