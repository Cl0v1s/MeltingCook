<app-adminreservations>
    <app-header></app-header>
    <app-tabbar tabs={ tabs }></app-tabbar>
    <div class="search">
        <form>
            <div>
                <h2>Chercher par hôte</h2>
                <app-userselector ref="host"></app-userselector>
                <input type="button" value="Afficher" onclick='{ showForHost }'>
            </div>
            <div>
                <h2>Chercher par invité</h2>
                <app-userselector ref="guest"></app-userselector>
                <input type="button" value="Afficher" onclick='{ showForGuest }'>
            </div>
        </form>
    </div>
    <div class="content">
        <app-reservations admin={ true } reservations="{ reservations }"></app-reservations>
    </div>
    <script>
        var tag = this;

        tag.tabs = null;
        tag.reservations = null;



        tag.on("before-mount", function()
        {
            tag.reservations = tag.opts.reservations;
            if(tag.reservations == null)
            {
                throw new Error("Reservations cant be null.");
            }

            tag.tabs = [
                {
                    name : "Signalement",
                    route : "/admin/reports",
                    selected : false
                },
                {
                    name : "Transactions",
                    route : "/admin/reservations",
                    selected : true
                },
                {
                    name : "Origines",
                    route :"/admin/origins",
                    selected : false
                },
                {
                    name : "Les Plus",
                    route :"/admin/pins",
                    selected : false
                }
            ];
        });



    </script>
</app-adminreservations>