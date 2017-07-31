<app-placeinput>
    <input type="text" ref="city" name="city" id="city" placeholder="Lieu de partage">
    <script>
        var tag = this;
        tag.value = "";

        tag.on("mount", function()
        {
            tag.retrieveCities();
        });

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
                vex.dialog.alert("Oups... Une erreur est survenue. Veuillez réessayer plus tard.");
                route("/");
            });
        }
    </script>
</app-placeinput>