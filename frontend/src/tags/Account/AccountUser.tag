<app-accountuser>
    <app-header ></app-header>
    <app-tabbar tabs='{ tabs }'></app-tabbar>
    <div class="content">
        <app-usereditform ref="form" user='{ user }' callback='{ send }'></app-usereditform>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.tabs = null;
        tag.user = null;

        tag.on("before-mount", function()
        {
            tag.user = tag.opts.user;

            tag.tabs = [{
                    name: "Cuisine",
                    route: "/account",
                    selected: false
                },
                {
                    name: "Recettes",
                    route: "/account/recipes",
                    selected: false
                },
                {
                    name: "Réservations",
                    route: "/account/reservations",
                    selected: false
                },
                {
                    name: "Profil",
                    route: "/account/user",
                    selected: true
                }
            ];
        });

        tag.send = function()
        {
            if(tag.user == null || tag.user.id === null)
            {
                NotificationManager.showNotification("Félicitation ! Vous êtes désormais un membre de Melting Cook. Vous pouvez vous connecter.", "success");
            }
            else 
            {
                NotificationManager.showNotification("Vos informations ont bien été mises à jour !", "success");
            }
            route("/");
        };
    </script>
</app-accountuser>