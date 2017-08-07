<app-recipeitem onclick={ details }>
    <div class="user">
        <div class="img" style="background-image: url('{ recipe.user.picture }');"></div>
        <div>
            <span>{ recipe.user.username} - { recipe.user.age } ans</span>
            <div class="Hearts nb-{ recipe.user.likes }"></div>
            <a onclick={ user }>Voir le profil</a>
        </div>
    </div>
    <div class="recipe">
        <div>
            <div>
                <span>{ recipe.date_start } - { recipe.date_end }</span>
            </div>
            <div>
                <span>{ recipe.name } - { recipe.origin[0] }</span>
             </div>
            <div>
                <div class="Pins" each={ p in recipe.pins }>{ p }</div>
            </div>
        </div>
        <div class="price">
            { recipe.price }€
        </div>
    </div>

    <script>
        var tag = this;

        tag.recipe = null;

        tag.on("before-mount", () => {
            tag.recipe = Adapter.adaptRecipe(tag.opts.recipe);

            if(tag.recipe == null && tag.opts.pass != null)
                tag.retrieveRecipe(tag.opts.pass);
        });

        tag.retrieveRecipe = function(id)
        {
            var request = App.request(App.Address + "/getrecipe", {
                "id" : id
            });
            request.then((response) => {
                tag.recipe = Adapter.adaptRecipe(response.data);
                tag.update();
            });
            request.catch((error) => {
                                        ErrorHandler.alertIfError(error);

            })
        };

        tag.details = function()
        {
            if(tag.recipe != null)
                route("/recipe/"+tag.recipe.id);
        }

        tag.user = function()
        {
            if(tag.recipe != null && tag.recipe.user != null)
                route("/user/"+tag.recipe.user.id);
        }

    </script>
</app-recipeitem>
