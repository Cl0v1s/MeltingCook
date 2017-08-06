<app-recipelist>
    <app-header></app-header>
    <app-recipes recipes={ recipes }></app-recipes>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.recipes = null;

        tag.on("before-mount", function () {
            tag.recipes = tag.opts.recipes;

            if (tag.recipes == null)
                tag.retrieveRecipes();
        });

        tag.retrieveRecipes = function () {
            var request = App.request(App.Address + "/getrecipes", null);
            request.then((response) => {
                tag.recipes = response.data;
                tag.update();
            });
            request.catch((error) => {
                if (error == null) {
                    vex.dialog.alert("Ooops... Une erreur est survenue. Veuillez réessayer plus tard.");
                }
            });
        };
    </script>
</app-recipelist>