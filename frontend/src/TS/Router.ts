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

    private setRoutes() : void
    {

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