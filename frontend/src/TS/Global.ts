var riot = <Riot>require("riot");


// ACCOUNT
require("./../../tags/Account/AccountKitchen.tag");
require("./../../tags/Account/AccountRecipes.tag");
require("./../../tags/Account/AccountReservations.tag");
require("./../../tags/Account/AccountUser.tag");

// COMMENT
require("./../../tags/Comment/CommentEditForm.tag");
require("./../../tags/Comment/CommentItem.tag");
require("./../../tags/Comment/CommentList.tag");
require("./../../tags/Comment/Comments.tag");

// IMMUTABLE
require("./../../tags/Immutable/Error.tag");
require("./../../tags/Immutable/Home.tag");
require("./../../tags/Immutable/Login.tag");
require("./../../tags/Immutable/ResetPasswordForm.tag");
require("./../../tags/Immutable/CGU.tag");

// MISC
require("./../../tags/Misc/DateInput.tag");
require("./../../tags/Misc/Footer.tag");
require("./../../tags/Misc/Header.tag");
require("./../../tags/Misc/Hearts.tag");
require("./../../tags/Misc/ManyInputs.tag");
require("./../../tags/Misc/OriginInput.tag");
require("./../../tags/Misc/PinsInput.tag");
require("./../../tags/Misc/PlaceHint.tag");
require("./../../tags/Misc/PlaceInput.tag");
require("./../../tags/Misc/TabBar.tag");
require("./../../tags/Misc/TimeInput.tag");
require("./../../tags/Misc/UserSelector.tag");


// RECIPE
require("./../../tags/Recipe/Recipe.tag");
require("./../../tags/Recipe/RecipeEdit.tag");
require("./../../tags/Recipe/RecipeEditForm.tag");
require("./../../tags/Recipe/RecipeItem.tag");
require("./../../tags/Recipe/RecipeList.tag");
require("./../../tags/Recipe/Recipes.tag");

// REPORT
require("./../../tags/Report/Reports.tag");
require("./../../tags/Report/ReportItem.tag");
require("./../../tags/Report/ReportEditForm.tag");

// ORIGIN
require("./../../tags/Origin/OriginEditForm.tag");

// PIN
require("./../../tags/Pin/PinEditForm.tag");


// RESERVATION
require("./../../tags/Reservation/ReservationValidateForm.tag");
require("./../../tags/Reservation/Reservation.tag");
require("./../../tags/Reservation/ReservationItem.tag");
require("./../../tags/Reservation/Reservations.tag");

// SEARCH
require("./../../tags/Search/Search.tag");
require("./../../tags/Search/SearchItem.tag");
require("./../../tags/Search/Searcher.tag");
require("./../../tags/Search/SearchResults.tag");

// USER

require("./../../tags/User/User.tag");
require("./../../tags/User/UserEdit.tag");
require("./../../tags/User/UserEditForm.tag");
require("./../../tags/User/UserItem.tag");
require("./../../tags/User/UserPasswordForm.tag");
require("./../../tags/User/Users.tag");

// ADMIN
require("./../../tags/Admin/AdminReports.tag");
require("./../../tags/Admin/AdminOrigins.tag");
require("./../../tags/Admin/AdminPins.tag");
require("./../../tags/Admin/AdminReservations.tag");



    

class App
{
    public static Address : string = "http://192.168.1.19/MC/backend/src/API";

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
        NotificationManager.showNotification("Oups... Il y a une erreur dans le formulaire. Pensez à Vérifier les informations renseignées !", "error");
    }


    public static request(address, data, redirect = true, bg = true)
    {
        return new Promise(function(resolve, reject)
        {
            var href=window.location.href;
            if(data == null)
                data = {};
            if(Login.GetInstance().isLogged() && data.token == null)
                data.token = Login.GetInstance().Token();
            var request = ajax({
                method : "POST",
                url : address,
                "data" : data
            });
            if(bg)
                App.showLoading();
            request.then(function(response)
            {
                if(bg)
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
                if(bg)
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
        App.Page = riot.mount("div#app", tag, data);
        window.scroll(0,0);
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
        var hide = document.createElement("div");
        hide.id="hidder";
        hide.addEventListener("click", App.hidePopUp);
        document.body.appendChild(hide);

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
            if(document.querySelector("div#hidder") != null)
                document.querySelector("div#hidder").remove();
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
    NotificationManager.GetInstance().start();
});
