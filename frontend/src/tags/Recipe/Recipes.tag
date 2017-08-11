<app-recipes>
    <app-recipeitem each='{ recipe in recipes }' recipe='{ recipe }'></app-recipeitem>

    <script>
        var tag = this;

        tag.recipes = null;

        tag.on("before-mount", () => {
            tag.recipes = tag.opts.recipes;
            if(tag.recipes === null)
                throw new Error("Recipes cant be null.");
        });

        tag.setRecipes = function(recipes)
        {
            tag.recipes = recipes;
            tag.update();
        }
    </script>
</app-recipes>