<app-adminreports>
    <app-header></app-header>
    <app-tabbar tabs="{ tabs }"></app-tabbar>
    <div class="content no-margin">
        <div class="search">
            <form name="search-target">
                <h2>Chercher par cible</h2>
                <app-userselector ref="target"></app-userselector>                
                <input type="button" value="Rechercher" onclick='{ showForTarget }'>
            </form>
            <form name="search-author">
                <h2>Chercher par auteur</h2>
                <app-userselector ref="author"></app-userselector>     
                <input type="button" value="Rechercher" onclick='{ showForAuthor }'>
            </form>
        </div>
        <app-reports reports="{ reports }"></app-reports>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.tabs = null;
        tag.reports = null;
        tag.targets = null;
        tag.authors = null;

        tag.on("before-mount", function()
        {
            tag.reports = tag.opts.reports;
            if(tag.reports == null)
                throw new Error("Reports cant be null");

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
                },
                {
                    name : "Origines",
                    route :"/admin/origins",
                    selected : false
                }
                ,
                {
                    name : "Les Plus",
                    route :"/admin/pins",
                    selected : false
                }
            ];
        });

        tag.showForTarget = function()
        {
            route("/admin/reports/to/"+tag.refs.target.value);
        };


        tag.showForAuthor = function()
        {
            route("/admin/reports/by/"+tag.refs.author.value);
        };

    </script>
</app-adminreports>