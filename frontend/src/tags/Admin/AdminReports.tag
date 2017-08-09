<app-adminreports>
    <app-header></app-header>
    <app-tabbar tabs={ tabs }></app-tabbar>
    <div>
        <app-reports></app-reports>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.tabs = null;

        tag.on("before-mount", function()
        {
            tag.tabs = [
                {
                    name : "Signalement",
                    route : "/admin/reports",
                    selected : true
                },
                {
                    name : "Transactions",
                    route : "/admin/reservations",
                    selected : false
                }
            ];
        });
    </script>
</app-adminreports>