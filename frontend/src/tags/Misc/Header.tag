<app-header>
    <img>
    <nav>
        <a class="Action" class={ invisible : logged == false}><span>Partager un voyage culinaire</span></a>
        <a class="Button register" class={ invisible: logged == true }><span>Inscription</span></a> 
        <a class="Button login" class={ invisible: logged == true }><span>Connexion</span></a>
    </nav>

    <script>
        var tag = this;
        tag.logged = false;

        tag.on("before-mount", function()
        {
            if(Cookies.hasItem("token") == true)
            {
                tag.logged = true;
            }
            else tag.logged = false;
        });


    </script>
</app-header>