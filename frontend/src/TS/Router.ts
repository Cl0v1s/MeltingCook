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

    private setRoutes() : void
    {
        // Account
        route("/account/recipes", this.accountRecipes);
        route("/account/reservations", this.accountReservations);
        route("/account/user", this.accountUser);
        route("/account", this.accountKitchen);


        // Base
        route("login", function () {
            App.changePage("app-login", null);
        });

        route("register", function () {
            App.changePage("app-useredit", null);
        });

        route('', function () {
            App.changePage("app-home", null);
        });

        route('', function () {
            App.changePage("app-home", null);
        });
        /*

         // Account
         route("/account/recipes", function()
         {
         App.changePage("app-accountrecipes", null);
         });
         route("/account/reservations", function()
         {
         App.changePage("app-accountreservations", null);
         });
         route("/account/user", function()
         {
         App.changePage("app-accountuser", null);
         });
         route("/account", function()
         {
         App.changePage("app-accountkitchen", null);
         });

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

         // User
         route("user/edit/*", function (id) {
         App.changePage("app-useredit", id);
         });

         route("user/add", function () {
         App.changePage("app-useredit", null);
         });

         route("user/*", function (id) {
         App.changePage("app-user", id);
         });

         // Immutable
         route("/error/*", function (message) {
         App.changePage("app-error", message);
         });







         */
    }
}