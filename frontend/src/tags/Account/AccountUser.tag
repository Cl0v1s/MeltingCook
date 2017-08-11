<app-accountuser>
    <app-header ></app-header>
    <app-tabbar tabs='{ tabs }'></app-tabbar>
    <div>
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
                    selected: true
                },
                {
                    name: "Profil",
                    route: "/account/user",
                    selected: false
                }
            ];
        });

        tag.send = function()
        {
            if(tag.user.id === null)
            {
                vex.dialog.alert("Félicitation ! Vous êtes désormais un membre de Melting Cook. Vous pouvez vous connecter.");
            }
            else 
            {
                vex.dialog.alert("Vos informations ont bien été mises à jour !");
            }
            route("/");
        };
    </script>
</app-accountuser>