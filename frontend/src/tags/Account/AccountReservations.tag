<app-accountreservations>
    <app-header></app-header>
    <app-tabbar tabs={ tabs }></app-tabbar>
    <div>
        <app-reservations ref="reservations"></app-reservations>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.tabs = null;
        tag.reservations = null;

        tag.on("before-mount", function () {
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
            tag.retrieveReservations();
        });

        tag.retrieveReservations = function()
        {
            var filters = {
                "guest_id" : Login.GetInstance().User()
            };
            var request = App.request(App.Address + "/getreservations", {
                filters : JSON.stringify(filters)
            });
            request.then((response) => {
                tag.reservations = response.data;
                tag.refs.reservations.setReservations(tag.reservations);
            });
            request.catch((error) => {
                ErrorHandler.alertIfError(error);
            });
        };
    </script>
</app-accountreservations>