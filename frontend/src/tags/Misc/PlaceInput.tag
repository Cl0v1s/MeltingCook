<app-placeinput>
    <input type="text" ref="city" name="city" id="city" placeholder="Lieu de partage">
    <script>
        var tag = this;
        tag.value = "";
        tag.city_interval = null;

        tag.on("mount", function()
        {
            var arm = function()
            {
                clearTimeout(tag.city_interval);
                tag.city_interval = setTimeout(tag.retrieveCities, 1500);
                tag.value = "";
            }
            tag.refs.city.addEventListener("keyup", arm);


        });

        tag.retrieveCities = function()
        {
            var retrieve = App.request("http://api.geonames.org/postalCodeSearchJSON?placename="+tag.refs.city.value+"&country=FR&username=portron_oim")
            retrieve.then(function(response)
            {
                $('#city').selectize({
                    delimiter: ";",
                    persist: false,
                    maxItems: null,
                    valueField: ['lat', 'lng'],
                    labelField: 'placeName',
                    searchField: ['placeName'],
                    options: response.postalCodes,
                    onChange : function(value)
                    {
                        tag.value = value;
                    },
                    create: function (input) {
                        return {
                            placeName: input
                        };
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