<app-user>
    <app-header></app-header>
    <div>
        <div class="banner" style="background-image: url('{ user.banner }');">
        </div>
        <div class="head">
            <img src={ user.picture }>
            <div class="identity">
                <span>{ user.username }</span>
                <span>{ user.age } ans</span>
            </div>
            <a class="Button verified">
                <span>Cuisinnier vérifié</span>
            </a>
            <div class="identity">
                <input type="button" class="large" onclick={ recipes } value="Voir les recettes">
            </div>
            <div class="identity">
                <input type="button" class="large" onclick={ comments } value="Voir les avis">
            </div>
            <div class={ identity : true, invisible : owner != true }>
                <input type="button" class="large" onclick={ edit } value="Editer mon profil">
            </div>
            <div class={ identity : true, invisible : owner == true }>
                <input type="button" class="large" onclick={ report } value="Signaler">
            </div>
        </div>
        <div class="description">
            <h2>Présentation du chef</h2>
            <p>
                { user.description }
            </p>
        </div>
        <div class="more">
            <div class={ discease : true, invisible : user.discease.length <= 0 }>
                <h2>Ses allergies</h2>
                <ul>
                    <li each={ d in user.discease }>{ d }</li>
                </ul>
            </div>
            <div class={ preference : true, invisible : user.preference.length <= 0 }>
                <h2>Ses inspirations</h2>
                <ul>
                    <li each={ p in user.preference }>{ p }</li>
                </ul>
            </div>
            <div>
                <h2>Ses "plus"</h2>
                <ul>
                    <li class="Pins" each={ p in user.pins }><span>{ p }</span></li>
                </ul>
            </div>
        </div>
        <div class="comments">
            <h2>Ses avis</h2><div class="Hearts nb-{ user.likes }"></div>
            <app-comments comments={ user.comments }></app-comments>
        </div>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.user = tag.opts.user;
        tag.owner = false;

        tag.on("mount", function()
        {
            if(tag.user == null && tag.opts.pass != null)
                tag.retrieveUser(tag.opts.pass);
        });

        tag.recipes = function()
        {
            if(tag.user == null || tag.user.id == null)
                return;
            var filters = JSON.stringify({
                "User_id" : tag.user.id 
            });
            var request = App.request(App.Address + "/getrecipes", {
                "filters" : filters
            });
            request.then((response) => {
                App.changePage("app-recipelist", null, { "recipes" : response.data });
            });
            request.catch((error) => {
                if(error == null)
                    vex.dialog.alert("Ooops... Une erreur est survenue. Veuillez réessayer plus tard.");
            });

        };

        tag.comments = function()
        {
            if(tag.user == null || tag.user.id == null)
                return;
            var filters = JSON.stringify({
                "author_id" : tag.user.id 
            });
            var request = App.request(App.Address + "/getcomments", {
                "filters" : filters
            });
            request.then((response) => {
                App.changePage("app-commentlist", null, { "comments" : response.data });
            });
            request.catch((error) => {
                        ErrorHandler.alertIfError(error);

            });
        };

        tag.edit = function()
        {
            if(tag.user != null && tag.user.id != null)
                route("/user/edit/"+tag.user.id);
        }

        tag.report = function()
        {
            if(tag.user == null || tag.user.id == null)
                return;
            var callback = function()
            {
                App.hidePopUp();
                vex.dialog.alert("L'utilisateur a bien été signalé. Merci de votre vigilance.");
            };
            var report = App.showPopUp("app-reporteditform", "Signaler un utilisateur", { "callback" : callback, "target" : tag.user.id });
        }

        tag.retrieveUser = function(id)
        {
            var request = App.request(App.Address + "/getuser", {
                "id" : id
            });
            request.then((response) => {
                tag.user = Adapter.adaptUser(response.data);
                tag.owner = Login.GetInstance().User().id == tag.user.id;
                tag.update();
            });
            request.catch((error) => {
                if(error == null)
                {
                    vex.dialog.alert("Ooops.. Une erreur est survenue. Veuillez réessayer plus tard.");
                }
                route("/");
            });
        }
    </script>
</app-user>