<app-adminreservations>
    <app-header></app-header>
    <app-tabbar tabs={ tabs }></app-tabbar>
    <app-reservations admin={ true }></app-reservations>
    <script>
        var tag = this;

        tag.tabs = null;

        tag.on("before-mount", function()
        {
            tag.tabs = [
                {
                    name : "Signalements",
                    route : "/admin/reports",
                    selected : false
                },
                {
                    name : "Transactions",
                    route : "/admin/reservations",
                    selected : true
                }
            ];
        }); 
    </script>
</app-adminreservations>