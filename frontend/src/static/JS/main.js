class Adapter {
    static adaptRecipe(recipe) {
        if (recipe.adapted === true)
            return recipe;
        recipe.adapted = true;
        var date_start = new Date(recipe.date_start * 1000);
        recipe.date_start_readable = date_start.getDate() + "/" + (date_start.getMonth() + 1) + "/" + date_start.getFullYear();
        var date_end = new Date(recipe.date_end * 1000);
        recipe.date_end_readable = date_end.getDate() + "/" + (date_end.getMonth() + 1) + "/" + date_end.getFullYear();
        if (recipe.pins != null)
            recipe.pins = recipe.pins.split(";");
        else
            recipe.pins = [];
        if (recipe.origin != null)
            recipe.origin = recipe.origin.split(";");
        else
            recipe.origin = [];
        if (recipe.items != null)
            recipe.items = recipe.items.split(";");
        else
            recipe.items = [];
        if (recipe.origin[recipe.origin.length - 1] == "" || recipe.origin[recipe.origin.length - 1] == null)
            recipe.origin.pop();
        if (recipe.items[recipe.items.length - 1] == "" || recipe.items[recipe.items.length - 1] == null)
            recipe.items.pop();
        if (recipe.pins[recipe.pins.length - 1] == "" || recipe.pins[recipe.pins.length - 1] == null)
            recipe.pins.pop();
        recipe.place_left = parseInt(recipe.places) - recipe.users.length;
        if (recipe.user != null) {
            var geolocation = recipe.user.geolocation.split(",");
            if (geolocation.length == 2) {
                recipe.latitude = geolocation[0];
                recipe.longitude = geolocation[1];
            }
        }
        recipe.price = parseInt(recipe.price);
        return recipe;
    }
    static adaptUser(user) {
        if (user.adapted === true)
            return user;
        user.adapted = true;
        if (user.discease != null)
            user.discease = user.discease.split(";");
        else
            user.discease = [];
        if (user.preference != null)
            user.preference = user.preference.split(";");
        else
            user.preference = [];
        if (user.pins != null)
            user.pins = user.pins.split(";");
        else
            user.pins = [];
        if (user.discease[user.discease.length - 1] == "" || user.discease[user.discease.length - 1] == null)
            user.discease.pop();
        if (user.preference[user.preference.length - 1] == "" || user.preference[user.preference.length - 1] == null)
            user.preference.pop();
        if (user.pins[user.pins.length - 1] == "" || user.pins[user.pins.length - 1] == null)
            user.pins.pop();
        if (user.preference.length >= 1) {
            user.style = user.preference[0];
        }
        return user;
    }
    static adaptReport(report) {
        switch (report.state) {
            case "1":
            case 1:
            default:
                report.message_state = "Nouveau";
                break;
            case "2":
            case 2:
                report.message_state = "En Cours";
                break;
            case "3":
            case 3:
                report.message_state = "Terminé";
                break;
        }
        return report;
    }
}
class ErrorHandler {
    static GetInstance() {
        return ErrorHandler.Instance;
    }
    handle(response) {
        if (response.state == "OK")
            return;
        var error = new Error();
        switch (response.data) {
            case 0:
                error.message = "Vos informations de connexion ne sont pas valides.";
                error.name = ErrorHandler.State.FATAL;
                break;
            case 1:
                error.message = "Vous n'avez pas les droits suffisants.";
                error.name = ErrorHandler.State.FATAL;
                break;
            case 2:
                error.name = ErrorHandler.State.ERROR;
                error.message = response.message + ".";
                break;
            case "23000":
            case 23000:
                error = this.handleSQL(response);
                break;
            case "105":
            case 105:
                error.message = "Une valeur requise est manquante. Veuillez vérifier le formulaire.";
                error.name = ErrorHandler.State.ERROR;
                break;
            case 101:
                var length = response.message.split(" than ")[1].split("\n\n#0")[0];
                error.message = "Une valeur est en dessous de la longueur requise de " + length + " caractères. Veuillez vérifier le formulaire.";
                error.name = ErrorHandler.State.ERROR;
                break;
            default:
                error.name = ErrorHandler.State.ERROR;
                error.message = "Ooops... Quelque chose s'est mal passé. Veuillez réessayer plus tard.";
                break;
        }
        throw error;
    }
    handleSQL(response) {
        var error = new Error();
        // gestion de l'unicité 
        if (response.message.indexOf(" 1062 ") != -1) {
            var value = response.message.split("Duplicate entry '")[1].split("' for key ")[0];
            error.message = "La valeur " + value + " transmise existe déjà dans la base de données. Veuillez corriger le formulaire.";
            error.name = ErrorHandler.State.ERROR;
        }
        return error;
    }
    static alertIfError(error) {
        if (error instanceof Error)
            vex.dialog.alert(error.message);
    }
}
ErrorHandler.State = {
    INFO: "INFO",
    ERROR: "ERROR",
    FATAL: "FATAL"
};
ErrorHandler.Instance = new ErrorHandler();
var Cookies = require("js-cookie");
var md5 = require("md5");
class Login {
    constructor() {
        this.token = null;
        this.user = null;
        this.token = Cookies.get("token");
        if (Cookies.get("user") != null)
            this.user = JSON.parse(Cookies.get("user"));
    }
    static GetInstance() {
        return Login.Instance;
    }
    Token() {
        return this.token;
    }
    User() {
        return this.user;
    }
    setToken(token) {
        this.token = token;
        Cookies.set("token", token);
    }
    setUser(user) {
        this.user = user;
        Cookies.set("user", JSON.stringify(user));
    }
    logout() {
        this.setToken(null);
        this.setUser(null);
    }
    isLogged() {
        if (this.token == null)
            return false;
        return true;
    }
    auth(username, password) {
        return new Promise((resolve, reject) => {
            var tmptoken = md5(username + md5(password));
            var retrieve = App.request(App.Address + "/auth", {
                token: tmptoken
            }, false);
            retrieve.then((response) => {
                this.setToken(tmptoken);
                this.setUser(response.data);
                resolve(response.data);
            });
            retrieve.catch((error) => {
                reject(error);
            });
        });
    }
}
Login.Instance = new Login();
/**
 * Created by clovis on 11/08/17.
 */
class Router {
    constructor() {
        this.setRoutes();
    }
    static GetInstance() {
        return Router.Instance;
    }
    start() {
        if (Login.GetInstance().isLogged() === false && window.location.href.indexOf("/error") === -1) {
            route("");
        }
        route.start(true);
    }
    /////////////////////////////////////////////////////////////////
    // Reservation
    reservationRecipe(id) {
        var requestRecipe = App.request(App.Address + "/getrecipe", {
            "id": id
        });
        requestRecipe.then(function (response) {
            if (response.data == null) {
                route("/error/404");
                return;
            }
            var requestUser = App.request(App.Address + "/getuser", {
                "id": response.data.User_id
            });
            var filters = {
                "Recipe_id": response.data.id
            };
            var requestReservations = App.request(App.Address + "/getreservations", {
                "filters": JSON.stringify(filters)
            });
            return Promise.all([Promise.resolve(response.data), requestUser, requestReservations]);
        }).then(function (responses) {
            console.log(responses);
            if (responses[1].data == null) {
                route("/error/404");
                return;
            }
            var recipe = responses[0];
            recipe.user = responses[1].data;
            recipe.guests = new Array();
            responses[2].data.forEach(function (reservation) {
                recipe.guests.push(reservation.guest);
            });
            App.changePage("app-reservation", {
                "recipe": recipe
            });
        }).catch(function (error) {
            if (error instanceof Error)
                ErrorHandler.alertIfError(error);
        });
    }
    // Error
    error(message) {
        if (message != null)
            message = decodeURI(message);
        App.changePage("app-error", {
            "message": message
        });
    }
    // USER
    user(id) {
        var retrieveUser = App.request(App.Address + "/getuser", {
            "id": id
        });
        var retrieveRecipes = App.request(App.Address + "/getrecipes", {
            "filters": JSON.stringify({
                "User_id": id
            })
        });
        var retrieveComments = App.request(App.Address + "/getcomments", {
            "filters": JSON.stringify({
                "target_id": id
            })
        });
        var request = Promise.all([
            retrieveUser, retrieveRecipes, retrieveComments
        ]);
        request.then(function (responses) {
            if (responses[0].data === null) {
                route("/error/404");
                return;
            }
            var user = Adapter.adaptUser(responses[0].data);
            var recipes = responses[1].data;
            var comments = responses[2].data;
            App.changePage("app-user", {
                "user": user,
                "recipes": recipes,
                "comments": comments
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    // RECIPE
    recipe(id) {
        var request = App.request(App.Address + "/getrecipe", {
            "id": id
        });
        request.then(function (response) {
            if (response.data === null) {
                route("/error/404");
                return;
            }
            var recipe = Adapter.adaptRecipe(response.data);
            var requestRecipe = Promise.resolve(recipe);
            var requestUser = App.request(App.Address + "/getuser", {
                "id": recipe.User_id
            });
            return Promise.all([requestRecipe, requestUser]);
        }).then(function (responses) {
            var recipe = responses[0];
            if (responses[1].data === null) {
                route("/error/404");
                return;
            }
            var user = responses[1].data;
            recipe.user = user;
            App.changePage("app-recipe", {
                "recipe": recipe
            });
        }).catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    recipeAdd() {
        if (Login.GetInstance().isLogged() == false) {
            route("/register");
            return;
        }
        App.changePage("app-recipeedit", null);
    }
    recipeEdit(id) {
        var request = App.request(App.Address + "/getrecipe", {
            "id": id
        });
        request.then(function (response) {
            if (response.data === null) {
                route("/error/404");
                return;
            }
            var recipe = Adapter.adaptRecipe(response.data);
            App.changePage("app-recipeedit", {
                "recipe": recipe
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    // ACCOUNT
    accountKitchen() {
        var filters = {
            target_id: Login.GetInstance().User().id
        };
        var request = App.request(App.Address + "/getcomments", {
            filters: JSON.stringify(filters)
        });
        request.then((response) => {
            var comments = response.data.splice(0, 5);
            App.changePage("app-accountkitchen", {
                "comments": comments
            });
        });
        request.catch((error) => {
            if (error instanceof Error) {
                App.changePage("app-accountkitchen", {
                    "comments": null
                });
            }
        });
    }
    accountRecipes() {
        var filters = {
            User_id: Login.GetInstance().User().id
        };
        var request = App.request(App.Address + "/getrecipes", {
            filters: JSON.stringify(filters)
        });
        request.then((response) => {
            var recipes = response.data;
            console.log(recipes);
            App.changePage("app-accountrecipes", {
                "recipes": recipes
            });
        });
        request.catch((error) => {
            ErrorHandler.alertIfError(error);
        });
    }
    accountReservations() {
        var filters = {
            "guest_id": Login.GetInstance().User().id
        };
        var request = App.request(App.Address + "/getreservations", {
            filters: JSON.stringify(filters)
        });
        request.then((response) => {
            var reservations = response.data;
            App.changePage("app-accountreservations", {
                "reservations": reservations
            });
        });
        request.catch((error) => {
            ErrorHandler.alertIfError(error);
        });
    }
    accountUser() {
        var request = App.request(App.Address + "/getuser", {
            "id": Login.GetInstance().User().id
        });
        request.then(function (response) {
            if (response.data === null) {
                route("/error/404");
                return;
            }
            var user = Adapter.adaptUser(response.data);
            App.changePage("app-accountuser", {
                "user": user
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    // SEARCH
    searchresults(recipes, params = null) {
        var pars = null;
        if (params != null) {
            pars = params.split(",");
        }
        var filters = {};
        if (recipes != null && recipes != "null")
            filters.id = recipes.split(",");
        else {
            App.changePage("app-searchresults", {
                "recipes": [],
                "params": pars
            });
            return;
        }
        var request = App.request(App.Address + "/getrecipes", {
            "filters": JSON.stringify(filters)
        });
        request.then(function (response) {
            App.changePage("app-searchresults", {
                "recipes": response.data,
                "params": pars
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    search() {
        App.changePage("app-search", null);
    }
    // Admin
    adminReports(target_id, author_id) {
        var filters = {};
        if (target_id != null)
            filters.target_id = target_id;
        if (author_id != null)
            filters.author_id = author_id;
        var request = App.request(App.Address + "/getreports", {
            "filters": JSON.stringify(filters)
        });
        request.then(function (response) {
            App.changePage("app-adminreports", {
                "reports": response.data
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    adminOrigins() {
        let request = App.request(App.Address + "/getorigins", null);
        request.then(function (response) {
            App.changePage("app-adminorigins", {
                "origins": response.data
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    adminPins() {
        let request = App.request(App.Address + "/getpinses", null);
        request.then(function (response) {
            App.changePage("app-adminpins", {
                "pins": response.data
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    ///////////////////////////////////////////////////////////////
    setRoutes() {
        // Reservation
        route("/reservation/recipe/*", this.reservationRecipe);
        // Admin
        route("/admin/reports/by/*", (author_id) => { this.adminReports(null, author_id); });
        route("/admin/reports/to/*", (target_id) => { this.adminReports(target_id, null); });
        route("/admin/reports", () => { this.adminReports(null, null); });
        route("/admin/origins", () => { this.adminOrigins(); });
        route("/admin/pins", () => { this.adminPins(); });
        // Account
        route("/account/recipes", this.accountRecipes);
        route("/account/reservations", this.accountReservations);
        route("/account/user", this.accountUser);
        route("/account", this.accountKitchen);
        // User
        route("/user/*", this.user);
        // Recipe
        route("/recipe/edit/*", this.recipeEdit);
        route("/recipe/add", this.recipeAdd);
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
        route("index", function () {
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
Router.Instance = new Router();
var riot = require("riot");
var tags = {
    // ACCOUNT
    "app-accountkitchen": require("./../../tags/Account/AccountKitchen.tag"),
    "app-accountrecipes": require("./../../tags/Account/AccountRecipes.tag"),
    "app-accountreservations": require("./../../tags/Account/AccountReservations.tag"),
    "app-accountuser": require("./../../tags/Account/AccountUser.tag"),
    // COMMENT
    "app-commenteditform": require("./../../tags/Comment/CommentEditForm.tag"),
    "app-commentitem": require("./../../tags/Comment/CommentItem.tag"),
    "app-commentlist": require("./../../tags/Comment/CommentList.tag"),
    "app-comments": require("./../../tags/Comment/Comments.tag"),
    // IMMUTABLE
    "app-error": require("./../../tags/Immutable/Error.tag"),
    "app-home": require("./../../tags/Immutable/Home.tag"),
    "app-login": require("./../../tags/Immutable/Login.tag"),
    // MISC
    "app-dateinput": require("./../../tags/Misc/DateInput.tag"),
    "app-footer": require("./../../tags/Misc/Footer.tag"),
    "app-header": require("./../../tags/Misc/Header.tag"),
    "app-hearts": require("./../../tags/Misc/Hearts.tag"),
    "app-manyinputs": require("./../../tags/Misc/ManyInputs.tag"),
    "app-origininput": require("./../../tags/Misc/OriginInput.tag"),
    "app-pinsinput": require("./../../tags/Misc/PinsInput.tag"),
    "app-placehint": require("./../../tags/Misc/PlaceHint.tag"),
    "app-placeinput": require("./../../tags/Misc/PlaceInput.tag"),
    "app-tabbar": require("./../../tags/Misc/TabBar.tag"),
    "app-timeinput": require("./../../tags/Misc/TimeInput.tag"),
    // RECIPE
    "app-recipe": require("./../../tags/Recipe/Recipe.tag"),
    "app-recipeedit": require("./../../tags/Recipe/RecipeEdit.tag"),
    "app-recipeeditform": require("./../../tags/Recipe/RecipeEditForm.tag"),
    "app-recipeitem": require("./../../tags/Recipe/RecipeItem.tag"),
    "app-recipelist": require("./../../tags/Recipe/RecipeList.tag"),
    "app-recipes": require("./../../tags/Recipe/Recipes.tag"),
    // REPORT
    "app-reports": require("./../../tags/Report/Reports.tag"),
    "app-reportitem": require("./../../tags/Report/ReportItem.tag"),
    "app-reporteditform": require("./../../tags/Report/ReportEditForm.tag"),
    // ORIGIN
    "app-origineditform": require("./../../tags/Origin/OriginEditForm.tag"),
    // PIN
    "app-pineditform": require("./../../tags/Pin/PinEditForm.tag"),
    // RESERVATION
    "app-reservation": require("./../../tags/Reservation/Reservation.tag"),
    "app-reservationitem": require("./../../tags/Reservation/ReservationItem.tag"),
    "app-reservations": require("./../../tags/Reservation/Reservations.tag"),
    // SEARCH
    "app-search": require("./../../tags/Search/Search.tag"),
    "app-searchitem": require("./../../tags/Search/SearchItem.tag"),
    "app-searcher": require("./../../tags/Search/Searcher.tag"),
    "app-searchresults": require("./../../tags/Search/SearchResults.tag"),
    // USER
    "app-user": require("./../../tags/User/User.tag"),
    "app-useredit": require("./../../tags/User/UserEdit.tag"),
    "app-usereditform": require("./../../tags/User/UserEditForm.tag"),
    "app-useritem": require("./../../tags/User/UserItem.tag"),
    "app-userpasswordform": require("./../../tags/User/UserPasswordForm.tag"),
    "app-users": require("./../../tags/User/Users.tag"),
    // ADMIN
    "app-adminreports": require("./../../tags/Admin/AdminReports.tag"),
    "app-adminorigins": require("./../../tags/Admin/AdminOrigins.tag"),
    "app-adminpins": require("./../../tags/Admin/AdminPins.tag"),
    "app-adminreservations": require("./../../tags/Admin/AdminReservations.tag"),
};
class App {
    static diagnosticForm(formname, errors) {
        for (var field in errors[formname]) {
            var nodes = document.getElementsByName(field);
            if (nodes.length <= 0)
                continue;
            var node = (nodes[0]);
            node.classList.add("error");
            node.addEventListener("focus", function (e) {
                e.target.classList.remove("error");
            });
            node.addEventListener("click", function (e) {
                e.target.classList.remove("error");
            });
        }
    }
    static request(address, data, redirect = true) {
        return new Promise(function (resolve, reject) {
            var href = window.location.href;
            if (data == null)
                data = {};
            if (address.indexOf(App.Address) != -1 && Login.GetInstance().isLogged() && data.token == null)
                data.token = Login.GetInstance().Token();
            var request = ajax({
                method: "POST",
                url: address,
                "data": data
            });
            App.showLoading();
            request.then(function (response) {
                App.hideLoading();
                if (App.checkPage(href) == false) {
                    reject(ErrorHandler.State.FATAL);
                    return;
                }
                if (address.indexOf(App.Address) == -1) {
                    resolve(response);
                    return;
                }
                try {
                    ErrorHandler.GetInstance().handle(response);
                    resolve(response);
                }
                catch (error) {
                    if (error.name == ErrorHandler.State.FATAL) {
                        if (redirect) {
                            var message = encodeURI(error.message);
                            reject(ErrorHandler.State.FATAL);
                            route("/error/" + message);
                            console.error(error.message);
                        }
                        else {
                            ErrorHandler.alertIfError(error);
                        }
                    }
                    else
                        reject(error);
                }
            });
            request.catch(function (error) {
                App.hideLoading();
                if (App.checkPage(href) == false) {
                    reject(ErrorHandler.State.FATAL);
                    return;
                }
                var message = encodeURI("Une erreur réseau a eu lieu. Vérifiez votre connexion et réessayez.");
                reject(ErrorHandler.State.FATAL);
                route("/error/" + message);
            });
        });
    }
    static checkPage(page) {
        if (window.location.href != page)
            return false;
        return true;
    }
    static changePage(tag, data) {
        if (App.Page != null) {
            App.Page.forEach(function (t) {
                t.unmount();
            });
            var e = document.createElement("div");
            e.id = "app";
            document.body.appendChild(e);
        }
        App.hideLoading();
        App.Page = riot.mount("div#app", tags[tag], data);
    }
    static showPopUp(tag, title, data) {
        if (App.PopUp != null) {
            App.PopUp.forEach(function (t) {
                t.unmount();
            });
            if (document.querySelector("div#popup") != null)
                document.querySelector("div#popup").remove();
        }
        var hide = document.createElement("div");
        hide.id = "hidder";
        hide.addEventListener("click", App.hidePopUp);
        document.body.appendChild(hide);
        var e = document.createElement("div");
        e.id = "popup";
        e.setAttribute("data-name", title);
        var d = document.createElement("div");
        e.appendChild(d);
        var close = document.createElement("div");
        close.className = "close";
        close.innerHTML = "🞩";
        e.appendChild(close);
        close.addEventListener("click", App.hidePopUp);
        document.body.appendChild(e);
        App.PopUp = riot.mount(d, tag, data);
        return App.PopUp;
    }
    static hidePopUp() {
        if (App.PopUp != null) {
            App.PopUp.forEach(function (t) {
                t.unmount();
            });
            if (document.querySelector("div#popup") != null)
                document.querySelector("div#popup").remove();
            if (document.querySelector("div#hidder") != null)
                document.querySelector("div#hidder").remove();
        }
    }
    static showLoading() {
        App.LoadingCounter++;
        if (document.getElementById("loading") != null)
            return;
        var e = document.createElement("div");
        e.id = "loading";
        document.body.appendChild(e);
    }
    static hideLoading() {
        App.LoadingCounter--;
        if (App.LoadingCounter > 0)
            return;
        var e = document.getElementById("loading");
        if (e == null)
            return;
        e.remove();
        App.LoadingCounter = 0;
    }
}
App.Address = "http://localhost:8080/API";
App.Page = null;
App.PopUp = null;
App.LoadingCounter = 0;
window.addEventListener("load", function () {
    Router.GetInstance().start();
});
class Search {
    static search(place, origin, date, price_start, price_end) {
        return new Promise((resolve, reject) => {
            var filters = {};
            if (place != null && place != "")
                filters["geolocation"] = place;
            if (origin != null && origin != "")
                filters["origin"] = origin;
            if (date != null && date != "") {
                filters["date_start"] = date;
                filters["date_end"] = date;
            }
            if (price_start != null)
                filters["price_start"] = price_start;
            if (price_end != null)
                filters["price_end"] = price_end;
            console.log(filters);
            var retrieve = App.request(App.Address + "/getrecipes", {
                "filters": JSON.stringify(filters)
            });
            retrieve.then(function (response) {
                var ids = [];
                response.data.forEach(function (recipe) {
                    ids.push(recipe.id);
                });
                resolve(ids);
            });
            retrieve.catch(function (error) {
                reject(error);
            });
        });
    }
}
/// <reference path="Login.ts" />
/// <reference path="Router.ts" />
/// <reference path="Global.ts" />
/// <reference path="Adapter.ts" />
/// <reference path="Search/Search.ts" />
window.Login = Login;
window.Router = Router;
window.App = App;
window.Adapter = Adapter;
window.Search = Search;
window.ErrorHandler = ErrorHandler;
//# sourceMappingURL=main.js.map