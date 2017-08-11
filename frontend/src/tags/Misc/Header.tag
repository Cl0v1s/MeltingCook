<app-header>
    <div class="img" onclick="{ home }"></div>
    <nav if="{ logged == false }">
        <a class='{ "Action" : true }'><span>Partager un voyage culinaire</span></a>
        <a class='{ "Button" : true, "register" : true}' onclick='{ register }'><span>Inscription</span></a>
        <a class='{ "Button" : true, "login" : true}' onclick='{ login }'><span>Connexion</span></a>
    </nav>
    <nav if='{ logged == true }' onclick='{ account }'>
        <span>{ user.username }</span>
        <div class="img" style="background-image: url('{user.picture}');"></div>
    </nav>

    <script>
        var tag = this;
        tag.logged = false;
        tag.user = null;

        tag.on("before-mount", function()
        {
            if(Login.GetInstance().isLogged() == true)
            {
                tag.logged = true;
                tag.user = Login.GetInstance().User();
            }
            else tag.logged = false;
        });

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
            route("/login");
        };

        tag.account = function()
        {
            route("/account");
        }


    </script>
</app-header>