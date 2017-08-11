<app-accountreservations>
    <app-header></app-header>
    <app-tabbar tabs={ tabs }></app-tabbar>
    <div>
        <app-reservations reservations="{ reservations }" ref="reservations"></app-reservations>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.tabs = null;
        tag.reservations = null;

        tag.on("before-mount", function () {
            tag.reservations = tag.opts.reservations;
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
    </script>
</app-accountreservations>