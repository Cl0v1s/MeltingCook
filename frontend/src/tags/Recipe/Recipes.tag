<app-recipes>
    <app-recipeitem each={ recipe in recipes } recipe={ recipe }></app-recipeitem>

    <script>
        var tag = this;

        tag.recipes = null;

        tag.on("before-mount", () => {
            tag.recipes = tag.opts.recipes;
            if(tag.recipes == null)
                tag.retrieveRecipes();
        });

        tag.setRecipes = function(recipes)
        {
            tag.recipes = recipes;
            tag.update();
        }

        tag.retrieveRecipes = function()
        {
            var request = App.request(App.Adress + "/getrecipes", null);
            request.then((response) => {
                tag.recipes = response.data;
                tag.update();
            });
            request.catch((error) => {
                ErrorHandler.alertIfError(error);
            });
        }
    </script>
</app-recipes>