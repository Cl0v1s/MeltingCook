<app-header>
    <div class="img" onclick="{ home }"></div>
    <nav>
        <a class='Action' onclick="{ addrecipe }"><span>Partager un voyage culinaire</span></a>
        <a class='Button register' if="{ logged == false }" onclick='{ register }'><span>Inscription</span></a>
        <a class='Button login' if="{ logged == false }" onclick='{ login }'><span>Connexion</span></a>
        <a if="{ logged == true }" onclick='{ account }'>
            <div class="img" style="background-image: url('{user.picture}');"></div>
        </a>
    </nav>

    <script>
        var tag = this;
        tag.logged = false;
        tag.user = null;

        tag.on("before-mount", function()
        {
            tag.auth();
        });

        tag.auth = function()
        {
            if(Login.GetInstance().isLogged() == true)
            {
                tag.logged = true;
                tag.user = Login.GetInstance().User();
            }
            else tag.logged = false;
        };

        tag.home = function()
        {
            route("/");
        }

        tag.register = function()
        {
            route("/register");
        };

        tag.login = function()
        {
            var callback = function()
            {
                App.hidePopUp();
                route("index");
            };
            App.showPopUp("app-login", "Connexion", {
                "callback" : callback
            });
        };

        tag.account = function()
        {
            route("/account");
        }

        tag.addrecipe = function()
        {
            if(tag.logged == true)
            {
                route("/recipe/add");
            }
            else
                route("/user/add");
        }


    </script>
</app-header>