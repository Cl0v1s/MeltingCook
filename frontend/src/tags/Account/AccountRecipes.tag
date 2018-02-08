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
        <div class="SwitchHandler">
            <span class="Switch">
                <a onclick='{ showFuture }' class="{ selected : state == 0 }">A venir</a>
                <a onclick='{ showPast }' class="{ selected : state == 1 }">Passées</a>
            </span>
        </div>
        <table>
            <thead>
                <tr>
                    <td>Nom</td>
                    <td>Participants</td>
                    <td>Action</td>
                </tr>
            </thead>
            <tbody>
                <tr each="{ recipe in list }" id="recipe-{ recipe.id }">
                    <td>
                        { recipe.name }
                    </td>
                    <td>
                        { recipe.users.length }
                    </td>
                    <td>
                        <a data-id="{ recipe.id }" onclick="{ see }">Voir</a>
                        <a data-id="{ recipe.id }" onclick="{ remove }">Annuler</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;
        tag.tabs = null;

        tag.last_recipe = null;
        tag.recipes = null;
        tag.list = null;

        tag.state = 0;

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

            tag.state = 0;

        });

        tag.remove = function(e)
        {
            let id = e.target.getAttribute('data-id');
            vex.dialog.confirm({
                message: 'Etes-vous sûr de vouloir annuler cette recette ? (Tous les participants seront prévenus et remboursés.)',
                callback: function (value) {
                    if (value) {
                        let request = App.request(App.Address + "/removerecipe", {
                            "id" : id
                        });
                        request.then(function(response){
                            tag.reload();
                            NotificationManager.showNotification("L'annulation a bien été prise en compte.", "success");
                        });
                        request.catch(function(error){
                            ErrorHandler.alertIfError(error);
                        });
                    }
                }
            })
        };

        tag.see = function(e)
        {
            let id = e.target.getAttribute('data-id');
            route("/recipe/"+id);
        },


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

        tag.showFuture = function(a)
        {
            var lst = tag.sortRecipes(true);
            tag.showRecipes(lst);
            tag.state = 0;
        };

        tag.showPast = function(a)
        {
            var lst = tag.sortRecipes(false);
            tag.showRecipes(lst);
            tag.state = 1;

        }
    </script>
</app-accountrecipes>