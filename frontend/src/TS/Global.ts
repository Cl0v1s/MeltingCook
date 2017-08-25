var riot = <Riot>require("riot");

var tags =
    {
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
        
    };

class App
{
    public static Address : string = "http://localhost:8080/API";

    private static Page = null;
    private static PopUp = null;
    private static LoadingCounter = 0;

    public static diagnosticForm(formname : string , errors : Object)
    {
        for(var field in errors[formname])
        {
                var nodes : NodeList = document.getElementsByName(field);
                if(nodes.length <= 0)
                    continue;
                var node = <HTMLElement>(nodes[0]);
                node.classList.add("error");
                node.addEventListener("focus", function(e)
                {
                    (<HTMLElement>e.target).classList.remove("error");
                });
            node.addEventListener("click", function(e)
            {
                (<HTMLElement>e.target).classList.remove("error");
            });
        }
    }


    public static request(address, data, redirect = true)
    {
        return new Promise(function(resolve, reject)
        {
            var href=window.location.href;
            if(data == null)
                data = {};
            if(address.indexOf(App.Address) != -1 && Login.GetInstance().isLogged() && data.token == null)
                data.token = Login.GetInstance().Token();
            var request = ajax({
                method : "POST",
                url : address,
                "data" : data
            });
            App.showLoading();
            request.then(function(response)
            {
                App.hideLoading();
                if(App.checkPage(href) == false)
                {
                    reject(ErrorHandler.State.FATAL);
                    return;
                }
                if(address.indexOf(App.Address) == -1)
                {
                    resolve(response);
                    return;
                }
                try
                {
                    ErrorHandler.GetInstance().handle(response);
                    resolve(response);
                }
                catch(error)
                {
                    if(error.name == ErrorHandler.State.FATAL)
                    {
                        if(redirect)
                        {
                            var message = encodeURI(error.message);
                            reject(ErrorHandler.State.FATAL);
                            route("/error/"+message);
                            console.error(error.message);
                        }
                        else 
                        {
                            ErrorHandler.alertIfError(error);
                        }
                    }
                    else 
                        reject(error);
                }
            });

            request.catch(function(error)
            {
                App.hideLoading();
                if(App.checkPage(href) == false)
                {
                    reject(ErrorHandler.State.FATAL);
                    return;
                }
                var message = encodeURI("Une erreur réseau a eu lieu. Vérifiez votre connexion et réessayez.");
                reject(ErrorHandler.State.FATAL);
                route("/error/"+message);
            });
        });
    }

    public static checkPage(page)
    {
        if(window.location.href != page)
            return false;
        return true;
    }


    public static changePage(tag, data)
    {
        if(App.Page != null)
        {
            App.Page.forEach(function(t)
            {
                t.unmount();
            });
            var e = document.createElement("div");
            e.id = "app";
            document.body.appendChild(e);
        }
        App.hideLoading();
        App.Page = riot.mount("div#app", tags[tag], data);
    }

    public static showPopUp(tag, title, data)
    {
        if(App.PopUp != null)
        {
            App.PopUp.forEach(function(t)
            {
                t.unmount();
            });
            if(document.querySelector("div#popup") != null)
                document.querySelector("div#popup").remove();
        }
        var e = document.createElement("div");
        e.id = "popup";
        e.setAttribute("data-name", title);
        var d = document.createElement("div");
        e.appendChild(d);
        var close = document.createElement("div");
        close.className="close";
        close.innerHTML = "🞩";
        e.appendChild(close);
        close.addEventListener("click", App.hidePopUp);
        document.body.appendChild(e);
        App.PopUp = riot.mount(d, tag, data);
        return App.PopUp;
    }

    public static hidePopUp()
    {
        if(App.PopUp != null)
        {
            App.PopUp.forEach(function(t)
            {
                t.unmount();
            });
            if(document.querySelector("div#popup") != null)
                document.querySelector("div#popup").remove();
        }
    }

    public static showLoading()
    {
        App.LoadingCounter++;
        if(document.getElementById("loading") != null)
            return;
        var e = document.createElement("div");
        e.id = "loading";
        document.body.appendChild(e);
    }

    public static hideLoading()
    {
        App.LoadingCounter--;
        if(App.LoadingCounter > 0)
            return;
        var e = document.getElementById("loading");
        if(e == null)
            return;
        e.remove();
        App.LoadingCounter = 0;
    }

}

window.addEventListener("load", function () {

    Router.GetInstance().start();

});
