<app-recipeitem>
    <script>
        var tag = this;

        tag.recipe = tag.opts.recipe;

        tag.on("mount", () => {
            if(tag.recipe == null && tag.opts.pass != null)
                tag.retrieveRecipe(tag.opts.pass);
        });

        tag.retrieveRecipe = function(id)
        {
            var request = App.request(App.Address + "/getrecipe", {
                "id" : id
            });
            request.then((response) => {
                tag.recipe = response.data;
                tag.update();
            });
        };

        tag.details = function()
        {
            if(tag.recipe != null)
                route("/recipe/"+tag.recipe.id);
        }

    </script>
</app-recipeitem>
