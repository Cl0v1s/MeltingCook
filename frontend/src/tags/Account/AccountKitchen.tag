<app-accountkitchen>
    <app-header></app-header>
    <app-tabbar tabs={ tabs }></app-tabbar>
    <div>
        <div class="header">
            <div class="img" style="background-image: url('{user.picture}');"></div>    
            <div class="identity">
                <h2>Bonjour {user.username}</h2>
                <ul>
                    <li><a onclick='{ edit }'>Modifier votre profil</a></li>
                    <li><a onclick='{ see }'>Voir votre profil public</a></li>
                </ul>
            </div>
        </div>
        <div class="comments">
            <h2>Commentaires Récents</h2>
            <app-comments ref="comments" if='{ comments != null }' comments='{ comments }'></app-comments>
        </div>

    </div>
    <app-footer></app-footer>


    <script>
        var tag = this;
        tag.tabs = null;
        tag.user = null;
        tag.comments = null;

        tag.on("before-mount", function()
        {
            tag.user = Login.GetInstance().User();
            tag.comments = tag.opts.comments;

            tag.tabs = [
                {
                    name: "Cuisine",
                    route: "/account",
                    selected : true
                },
                { 
                    name : "Recettes",
                    route : "/account/recipes",
                    selected : false
                },
                {
                    name : "Réservations",
                    route : "/account/reservations",
                    selected : false
                },
                {
                    name : "Profil",
                    route : "/account/user",
                    selected : false
                }
            ];
        });


        tag.edit = function()
        {
            route("/account/user");
        };

        tag.see = function()
        {
            route("/user/"+tag.user.id);
        }
    </script>
</app-accountkitchen>