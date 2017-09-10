<app-user>
    <app-header></app-header>
    <div>
        <div class="banner" style="background-image: url('{ user.banner }');">
        </div>
        <div class="content">
            <div class="head">
                <img src='{ user.picture }'>
                <div class="identity">
                    <span>{ user.username }</span>
                    <span>{ user.age } ans</span>
                    <span>Cuisinnier vérifié</span>

                </div>

            </div>

            <nav>
                <input type="button" onclick='{ showRecipes }' value="Voir les recettes">
                <input if='{owner==true}' type="button" onclick='{ manage }' value="Gérer mon profil">
                <input if='{owner==false}' class="peach" type="button" onclick='{ report }' value="Signaler">
            </nav>
            <div class="description">
                <h1>Présentation du chef</h1>
                <p>
                    { user.description }
                </p>
            </div>
            <div class="more">
                <div class='{ discease : true, invisible : user.discease.length <= 0 }'>
                    <h1>Ses allergies</h1>
                    <ul>
                        <li each={ d in user.discease }>{ d }</li>
                    </ul>
                </div>
                <div class='{ preference : true, invisible : user.preference.length <= 0 }'>
                    <h1>Ses inspirations</h1>
                    <ul>
                        <li each='{ p in user.preference }'>{ p }</li>
                    </ul>
                </div>
                <div>
                    <h1>Ses "plus"</h1>
                        <div class="Pins open" each='{ p in user.pins }'><span>{ p }</span></div>
                </div>
            </div>
            <div class="comments">
                <h1>Ses avis</h1>
                <app-hearts repeat="{ user.likes }"></app-hearts>
                <app-comments comments='{ user.comments }'></app-comments>
            </div>
        </div>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.user = null;
        tag.recipes = null;
        tag.comments = null;
        tag.owner = false;

        tag.on("before-mount", function () {
            tag.user = Adapter.adaptUser(tag.opts.user);
            if (tag.user == null)
                throw new Error("User cant be null.");
            tag.recipes = tag.opts.recipes;
            if (tag.recipes == null)
                throw new Error("Recipes cant be null.");
            tag.comments = tag.opts.comments;
            if (tag.comments == null)
                throw new Error("Comments cant be null.");

            if (tag.user.id == Login.GetInstance().User().id)
                tag.owner = true;
        });

        tag.manage = function () {
            route("/account");
        };

        tag.showRecipes = function()
        {
            var lst = new Array();
            tag.recipes.forEach(function(recipe)
            {
                lst.push(recipe.id);
            });
            route("/search/results/"+lst.join(","));
        }

        tag.report = function () {
            if (tag.user == null || tag.user.id == null)
                return;
            var callback = function () {
                App.hidePopUp();
                vex.dialog.alert("L'utilisateur a bien été signalé. Merci de votre vigilance.");
            };
            var report = App.showPopUp("app-reporteditform", "Signaler un utilisateur", {
                "callback": callback,
                "target": tag.user.id
            });
        }
    </script>
</app-user>