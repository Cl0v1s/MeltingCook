<app-accountrecipes>
    <app-header></app-header>
    <app-tabbar tabs={ tabs }></app-tabbar>
    <div class="content">
        <section class="header">
            <h1>La dernière recette proposée</h1>
            <div>
                <app-recipeitem if='{ last_recipe != null }' recipe='{ last_recipe }'></app-recipeitem>
                <div if='{ last_recipe == null }'>
                    Aucune recette proposée
                </div>
            </div>
        </section>
        <nav>
            <a onclick='{ showFuture }'>A venir</a>
            <a onclick='{ showPast }'>Passées</a>
        </nav>
        <app-recipes ref="recipes" recipes='{ list }' if='{ list != null }'></app-recipes>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;
        tag.tabs = null;

        tag.last_recipe = null;
        tag.recipes = null;
        tag.list = null;

        tag.on("before-mount", function()
        {
            tag.recipes = tag.opts.recipes;
            if(tag.recipes.length > 0)
                tag.last_recipe = tag.recipes[tag.recipes.length - 1];
            tag.list = tag.sortRecipes(true);

            tag.tabs = [
                {
                    name: "Cuisine",
                    route: "/account",
                    selected : false
                },
                { 
                    name : "Recettes",
                    route : "/account/recipes",
                    selected : true
                },
                {
                    name : "Réservations",
                    route : "/account/reservations",
                    selected : false
                },
                {
                    name : "Profil",
                    route : "/account/user",
                    selected : false
                }
            ];
        });


        tag.sortRecipes = function(futur)
        {
            lst = [];
            var now = new Date().getTime();
            tag.recipes.forEach((recipe) => {
                if(recipe === null || recipe.date_end === null)
                    return;
                var stamp = recipe.date_end * 1000;
                if(futur === true)
                {
                    if(stamp > now)
                        lst.push(recipe);
                }
                else 
                {
                    if(stamp < now)
                        lst.push(recipe);
                }
            });
            return lst;
        };

        tag.showRecipes = function(lst)
        {
            tag.list = lst;
            tag.refs.recipes.setRecipes(tag.list);
        };

        tag.showFuture = function()
        {
            var lst = tag.sortRecipes(true);
            console.log(lst);
            tag.showRecipes(lst);
        };

        tag.showPast = function()
        {
            var lst = tag.sortRecipes(false);
            console.log(lst);
            tag.showRecipes(lst);
        }
    </script>
</app-accountrecipes>