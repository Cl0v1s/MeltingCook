<app-recipeitem onclick='{ details }'>
    <div class="user" if='{ reduced == false }'>
        <div class="img" style="background-image: url('{ recipe.user.picture }');"></div>
        <div>
            <span>{ recipe.user.username} - { recipe.user.age } ans</span>
            <div class="Hearts nb-{ recipe.user.likes }"></div>
            <a onclick='{ user }'>Voir le profil</a>
        </div>
    </div>
    <div class="picture" if='{ reduced == true }'>
        <div class="img" style="background-image: url('{ recipe.picture }');"></div>
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
                <div class="Pins" each='{ p in recipe.pins }'>{ p }</div>
            </div>
        </div>
        <div class="price">
            { recipe.price }€
        </div>
    </div>

    <script>
        var tag = this;

        tag.reduced = false;
        tag.recipe = null;

        tag.on("before-mount", function(){
            if(tag.opts.recipe !== null)
                tag.recipe = Adapter.adaptRecipe(tag.opts.recipe);
            else
                throw new Error("Recipe cant be null");
            if(tag.opts.reduced !== null)
                tag.reduced = tag.opts.reduced;
        });

        tag.details = function()
        {
            if(tag.recipe !== null)
                route("/recipe/"+tag.recipe.id);
        };

        tag.user = function()
        {
            if(tag.recipe !== null && tag.recipe.user !== null)
                route("/user/"+tag.recipe.user.id);
        };

    </script>
</app-recipeitem>
