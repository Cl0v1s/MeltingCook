/**
 * Created by clovis on 11/08/17.
 */
class Router
{
    private static Instance : Router = new Router();

    public static GetInstance() : Router
    {
        return Router.Instance;
    }

    constructor()
    {
        this.setRoutes();
    }

    public start() : void
    {
        if (Login.GetInstance().isLogged() === false && window.location.href.indexOf("/error") === -1)
        {
            route("");
        }
        route.start(true);
    }

    /////////////////////////////////////////////////////////////////

    // Reservation
    private reservationRecipe(id) : void
    {
        var requestRecipe = App.request(App.Address + "/getrecipe", {
            "id" : id
        });
        requestRecipe.then(function(response : any)
        {
            if(response.data == null)
            {
                route("/error/404");
                return;
            }

            var requestUser = App.request(App.Address+ "/getuser", {
                "id" : response.data.User_id
            });
            var filters = {
                "Recipe_id" : response.data.id
            };
            var requestReservations = App.request(App.Address+"/getreservations", {
                "filters" : JSON.stringify(filters)
            });

            return Promise.all([Promise.resolve(response.data), requestUser, requestReservations]);
        }).then(function(responses : any)
        {
            console.log(responses);

            if(responses[1].data == null)
            {
                route("/error/404");
                return;
            }
            var recipe = responses[0];
            recipe.user = responses[1].data;
            recipe.guests = new Array();
            responses[2].data.forEach(function(reservation)
            {
                recipe.guests.push(reservation.guest);
            });
            App.changePage("app-reservation", {
                "recipe" : recipe
            });
        }).catch(function(error)
        {
            if(error instanceof Error)
                ErrorHandler.alertIfError(error);
        });
    }


    // Error
    private error(message:string) : void
    {
        if(message != null)
            message = decodeURI(message);
        App.changePage("app-error", {
            "message" : message
        });
    }

    // USER
    private user(id : number) : void
    {
        var retrieveUser = App.request(App.Address + "/getuser", {
            "id" : id
        });
        var retrieveRecipes = App.request(App.Address + "/getrecipes", {
           "filters" : JSON.stringify({
               "User_id" : id
           })
        });
        var retrieveComments = App.request(App.Address + "/getcomments", {
            "filters" : JSON.stringify({
                "target_id" : id
            })
        });

        var request = Promise.all([
            retrieveUser, retrieveRecipes, retrieveComments
        ]);

        request.then(function(responses : any)
        {
            if(responses[0].data === null) {
                route("/error/404");
                return;
            }
            var user = Adapter.adaptUser(responses[0].data);
            var recipes = responses[1].data;
            var comments = responses[2].data;
            App.changePage("app-user", {
                "user" : user,
                "recipes" : recipes,
                "comments" : comments
            });
        });
        request.catch(function(error)
        {
            ErrorHandler.alertIfError(error);
        });
    }

    // RECIPE
    private recipe(id : number) : void
    {
        var request = App.request(App.Address + "/getrecipe", {
            "id" : id
        });
        request.then(function(response : any)
        {
            if(response.data === null)
            {
                route("/error/404");
                return;
            }
            var recipe = Adapter.adaptRecipe(response.data);
            var requestRecipe = Promise.resolve(recipe);
            var requestUser = App.request(App.Address + "/getuser", {
                "id" : recipe.User_id
            });
            return Promise.all([requestRecipe, requestUser]);

        }).then(function(responses: any)
        {
            var recipe = responses[0];
            if(responses[1].data === null)
            {
                route("/error/404");
                return;
            }
            var user = responses[1].data;
            recipe.user = user;
            App.changePage("app-recipe", {
                "recipe" : recipe
            });
        }).catch(function(error)
        {
            ErrorHandler.alertIfError(error);
        });
    }

    private recipeEdit(id : number) : void
    {
        var request = App.request(App.Address + "/getrecipe", {
            "id" : id
        });
        request.then(function(response :any)
        {
            if(response.data === null)
            {
                route("/error/404");
                return;
            }
            var recipe = Adapter.adaptRecipe(response.data);
            App.changePage("app-recipeedit", {
                "recipe" : recipe
            });
        });
        request.catch(function(error)
        {
            ErrorHandler.alertIfError(error);
        });
    }

    // ACCOUNT
    private accountKitchen() : void
    {
        var filters = {
            target_id : Login.GetInstance().User().id
        };
        var request = App.request(App.Address + "/getcomments", {
            filters : JSON.stringify(filters)
        });
        request.then((response : any) => {
            var comments = response.data.splice(0,5);
            App.changePage("app-accountkitchen", {
                "comments" : comments
            });
        });
        request.catch((error) => {
            if(error instanceof Error)
            {
                App.changePage("app-accountkitchen", {
                    "comments" : null
                });
            }
        });
    }

    private accountRecipes() : void
    {
        var filters = {
            User_id : Login.GetInstance().User().id
        };
        var request = App.request(App.Address + "/getrecipes", {
            filters : JSON.stringify(filters)
        });
        request.then((response : any) => {
            var recipes = response.data;
            console.log(recipes);
            App.changePage("app-accountrecipes", {
                "recipes" : recipes
            });
        });
        request.catch((error) => {
            ErrorHandler.alertIfError(error);
        });
    }

    private accountReservations() : void
    {
        var filters = {
            "guest_id" : Login.GetInstance().User().id
        };
        var request = App.request(App.Address + "/getreservations", {
            filters : JSON.stringify(filters)
        });
        request.then((response : any) => {
            var reservations = response.data;
            App.changePage("app-accountreservations", {
                "reservations" : reservations
            });
        });
        request.catch((error) => {
            ErrorHandler.alertIfError(error);
        });
    }

    private accountUser() : void
    {
        var request = App.request(App.Address + "/getuser", {
            "id" : Login.GetInstance().User().id
        });
        request.then(function(response : any){
            if(response.data === null)
            {
                route("/error/404");
                return;
            }
            var user = Adapter.adaptUser(response.data);
            App.changePage("app-accountuser", {
                "user" : user
            });
        });
        request.catch(function(error)
        {
            ErrorHandler.alertIfError(error);
        });

    }

    // SEARCH
    private searchresults(recipes : string, params : string = null) : void
    {
        var pars : Array<string> = null;
        if(params != null)
        {
            pars = params.split(",");
        }

        var filters : any = {};
        if(recipes != null && recipes != "null")
            filters.id = recipes.split(",");
        else
        {
            App.changePage("app-searchresults", {
                "recipes" : [],
                "params" : pars
            });
            return;
        }
        var request = App.request(App.Address+"/getrecipes", {
            "filters" : JSON.stringify(filters)
        });
        request.then(function(response : any)
        {
            App.changePage("app-searchresults", {
                "recipes" : response.data,
                "params" : pars
            });
        });
        request.catch(function(error)
        {
            ErrorHandler.alertIfError(error);
        })
    }

    private search() : void
    {
        App.changePage("app-search", null);
    }


    ///////////////////////////////////////////////////////////////

    private setRoutes() : void
    {
        // Reservation
        route("/reservation/recipe/*", this.reservationRecipe);


        // Account
        route("/account/recipes", this.accountRecipes);
        route("/account/reservations", this.accountReservations);
        route("/account/user", this.accountUser);
        route("/account", this.accountKitchen);

        // User
        route("/user/*", this.user);

        // Recipe
        route("/recipe/edit/*", this.recipeEdit);
        route("/recipe/add", function()
        {
            App.changePage("app-recipeedit", null);
        });
        route("/recipe/*", this.recipe);


        // Search
        route("/search/results/*/params/*", this.searchresults);
        route("/search/results/*", this.searchresults);
        route("/search/results", this.search);
        route("/search", this.search);

        // Base
        route("error/404", () => {
            this.error(encodeURI("Page Introuvable."));
        });
        route("error/*", this.error);
        route("error", this.error);

        route("register", function () {
            App.changePage("app-useredit", null);
        });

        route('', function () {
            App.changePage("app-home", null);
        });

        route("index", function()
        {
            App.changePage("app-home", null);
        });
        /*

         // Recipe
         route("recipe/add", function () {
         App.changePage("app-recipeedit", null);
         });

         route("recipe/edit/*", function (id) {
         App.changePage("app-recipeedit", id);
         });

         route("recipe/*", function (id) {
         App.changePage("app-recipe", id);
         });


         // Immutable
         route("/error/*", function (message) {
         App.changePage("app-error", message);
         });







         */
    }
}