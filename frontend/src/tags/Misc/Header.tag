<app-header>
    <img onclick={ home }>
    <nav>
        <a class={ "Action" : true, invisible : logged == false}><span>Partager un voyage culinaire</span></a>
        <a class={ "Button" : true, "register" : true, invisible: logged == true } onclick={ register }><span>Inscription</span></a> 
        <a class={ "Button" : true, "login" : true, invisible: logged == true } onclick={ login }><span>Connexion</span></a>
    </nav>

    <script>
        var tag = this;
        tag.logged = false;

        tag.on("before-mount", function()
        {
            if(Login.GetInstance().isLogged() == true)
                tag.logged = true;
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


    </script>
</app-header>