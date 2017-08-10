class Adapter {
    static adaptRecipe(recipe) {
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
        return recipe;
    }
    static adaptUser(user) {
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
class App {
    static diagnosticForm(formname, errors) {
        console.log(errors);
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
    static changePage(tag, data, more = null) {
        if (App.Page != null) {
            App.Page.forEach(function (t) {
                t.unmount();
            });
            var e = document.createElement("div");
            e.id = "app";
            document.body.appendChild(e);
        }
        App.hideLoading();
        if (more == null)
            more = {};
        more.pass = data;
        App.Page = riot.mount("div#app", tag, more);
    }
    static showPopUp(tag, title, data) {
        if (App.PopUp != null) {
            App.PopUp.forEach(function (t) {
                t.unmount();
            });
            if (document.querySelector("div#popup") != null)
                document.querySelector("div#popup").remove();
        }
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
        }
    }
    static showLoading() {
        if (document.getElementById("loading") != null)
            return;
        var e = document.createElement("div");
        e.id = "loading";
        document.body.appendChild(e);
    }
    static hideLoading() {
        var e = document.getElementById("loading");
        if (e == null)
            return;
        e.remove();
    }
}
App.Address = "http://localhost:8080/API";
App.Page = null;
App.PopUp = null;
class Login {
    constructor() {
        this.token = null;
        this.user = null;
        this.token = Cookies.getItem("token");
        this.user = JSON.parse(Cookies.getItem("user"));
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
        Cookies.setItem("token", token, null, "/");
    }
    setUser(user) {
        this.user = user;
        Cookies.setItem("user", JSON.stringify(user), null, "/");
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
            var retrieve = App.request(App.Address + "/getrecipes", {
                "filters": JSON.stringify(filters)
            });
            retrieve.then(function (response) {
                resolve(response.data);
            });
            retrieve.catch(function (error) {
                reject(error);
            });
        });
    }
}
//# sourceMappingURL=global.js.map