<app-recipeitem onclick='{ details }'>

    <div class="recipe">
        <div class="img" style="background-image: url('{ recipe.picture }');"></div>
        <h1>
            { recipe.name }
        </h1>
        <h1>
            { recipe.origin[0] }
        </h1>
        <div>
            <span>{ recipe.date_start_readable } - { recipe.date_end_readable }</span>
        </div>
        <div>
            <div class="Pins" if="{ recipe.pins.length > 0 }" each='{ p in recipe.pins }'>{ p }</div>
        </div>
        <div class="price">
            { recipe.price }€
        </div>
    </div>
    <div class="user">
        <div class="img" style="background-image: url('{ recipe.user.picture }');"></div>
        <div class="name">
            <h1>
                { recipe.user.username}
            </h1>
            <h2>
                { recipe.user.age } ans
            </h2>
        </div>
        <app-hearts repeat="{ recipe.user.likes }"></app-hearts>
    </div>

    <script>
        var tag = this;

        tag.recipe = null;

        tag.on("before-mount", function () {

            if (tag.opts.recipe !== null)
                tag.recipe = Adapter.adaptRecipe(tag.opts.recipe);
            else
                throw new Error("Recipe cant be null");

        });

        tag.details = function () {
            if (tag.recipe !== null)
                route("/recipe/" + tag.recipe.id);
        };

        tag.user = function () {
            if (tag.recipe !== null && tag.recipe.user !== null)
                route("/user/" + tag.recipe.user.id);
        };

    </script>
</app-recipeitem>
