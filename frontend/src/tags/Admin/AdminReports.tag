<app-adminreports>
    <app-header></app-header>
    <app-tabbar tabs="{ tabs }"></app-tabbar>
    <div class="content no-margin">
        <div class="search">
            <form name="search-target">
                <h2>Chercher par cible</h2>
                <input type="text" name="target" ref="target">
                <p class="hint">
                    Ce champ ne peut etre vide.
                </p>
                <input type="button" value="Rechercher" onclick='{ showForTarget }'>
                <div if="{ targets != null }">
                    <table class="dark">
                        <tr>
                            <td>Nom</td><td>Action</td>
                        </tr>
                        <tr each="{ target in targets }">
                            <td>{ target.username }</td><td><a href="#/admin/reports/to/{ target.id }">Voir</a></td>
                        </tr>
                    </table>
                </div>
            </form>
            <form name="search-author">
                <h2>Chercher par auteur</h2>
                <input type="text" name="author" ref="author"><input type="button" value="Rechercher" onclick='{ showForAuthor }'>
                <div if="{ authors != null }">
                    <table class="dark">
                        <tr>
                            <td>Nom</td><td>Action</td>
                        </tr>
                        <tr each="{ author in authors }">
                            <td>{ author.username }</td><td><a href="#/admin/reports/by/{ author.id }">Voir</a></td>
                        </tr>
                    </table>
                </div>
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
                }
            ];
        });

        tag.showForTarget = function()
        {
            var valid = new Validatinator({
                "search-target": {
                    "target" : "required"
                }
            });
            if (valid.passes("search-target")) {
                tag.retrieveTarget(tag.refs.target.value);
            }
            if(valid.fails("search-target"))
            {
                App.diagnosticForm("search-target", valid.errors);
            }
        };

        tag.retrieveTarget = function(name)
        {
            var request = App.request(App.Address + "/getusers", {
                "filters" : JSON.stringify({
                    "username" : name
                })
            });
            request.then(function(response) {
                tag.targets = response.data;
                tag.update();
            });
            request.catch(function(error)
            {
                ErrorHandler.alertIfError(error);
            });
        };

        tag.showForAuthor = function()
        {
            var valid = new Validatinator({
                "search-author": {
                    "author" : "required"
                }
            });
            if (valid.passes("search-author")) {
                tag.retrieveAuthor(tag.refs.author.value);
            }
            if(valid.fails("search-author"))
            {
                App.diagnosticForm("search-author", valid.errors);
            }
        };

        tag.retrieveAuthor = function(name)
        {
            var request = App.request(App.Address + "/getusers", {
                "filters" : JSON.stringify({
                    "username" : name
                })
            });
            request.then(function(response) {
                tag.authors = response.data;
                tag.update();
            });
            request.catch(function(error)
            {
                ErrorHandler.alertIfError(error);
            });
        };
    </script>
</app-adminreports>