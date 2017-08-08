<app-accountrecipes>
    <app-header></app-header>
    <app-tabbar tabs={ tabs }></app-tabbar>
    <div>
        <div class="header">
            <h2>La dernière recette proposée</h2>
            <div>
                <app-recipeitem if={ last_recipe != null } recipe={ last_recipe }></app-recipeitem>
                <div if={ last_recipe == null }>
                    Aucune recette proposée
                </div>
            </div>
        </div>
        <nav>
            <a onclick={ showFuture }>A venir</a>
            <a onclick={ showPast }>Passées</a>
        </nav>
        <app-recipes ref="recipes" if={ list != null }></app-recipes>
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

        tag.retrieveRecipes = function()
        {
            var filters = {
                User_id : Login.GetInstance().User()
            };
            var request = App.request(App.Address + "/getrecipes", {
                filters : JSON.stringify(filters)
            });
            request.then((response) => {
                tag.recipes = response.data;
                tag.last_recipe = tag.recipes[tag.recipes.length - 1];
                var lst = tag.sortRecipes(true);
                tag.update();
                tag.showRecipes(lst);
            });
            request.catch((error) => {
                ErrorHandler.alertIfError(error);
            });
        }

        tag.sortRecipes = function(futur)
        {
            lst = [];
            var now = new Date().getTime();
            tag.recipes.forEach((recipe) => {
                if(recipe == null || recipe.date_end == null)
                    return;
                var stamp = recipe.date_end * 1000;
                if(futur == true)
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
        }

        tag.showRecipes = function(lst)
        {
            tag.list = lst;
            tag.refs.recipes.setRecipes(tag.list);
        }

        tag.showFutur = function()
        {
            var lst = tag.sortRecipes(true);
            tag.showRecipes(lst);
        }

        tag.showPast = function()
        {
            var lst = tag.sortRecipes(false);
            tag.showRecipes(lst);
        }
    </script>
</app-accountrecipes>