<app-reports>
    <div>
        <nav>
            <a onclick={ showNews }>Nouveaux</a>
            <a onclick={ showCurrents }>En cours</a>
            <a onclick={ showEnds }>Terminés</a>
        </nav>
        <div>
            <label>Chercher par cible</label>
            <input type="number" ref="target"><input type="button" value="Afficher" onclick={ showForTarget }>
        </div>
        <div>
            <label>Chercher par auteur</label>
            <input type="number" ref="author"><input type="button" value="Afficher" onclick={ showForAuthor }>
        </div>
        <div>
            <input type="button" value="Tout Afficher" onclick={ showAll }>
        </div>
    </div>
    <app-reportitem each={ report in list} report={ report }></app-reportitem>
    <script>
        var tag = this;

        tag.reports = null;

        tag.list = null;

        tag.news = null;
        tag.currents = null;
        tag.ends = null;

        tag.on("before-mount", function () {
            tag.reports = tag.opts.reports;

            if (tag.reports == null)
                tag.retrieveReports();
            else
                tag.sortReports();
        });

        tag.retrieveReports = function (filters = null) {
            var data = {};
            if(filters != null)
                data.filters = JSON.stringify(filters);

            var request = App.request(App.Address + "/getreports", data);
            request.then((response) => {
                tag.reports = response.data;
                tag.sortReports();
            });
            request.catch((error) => {
                        ErrorHandler.alertIfError(error);

            });
        }

        tag.sortReports = function () {
            if (tag.reports == null)
                return;
            tag.news = new Array();
            tag.currents = new Array();
            tag.ends = new Array();
            tag.reports.forEach((report) => {
                switch (report.state) {
                    case "1":
                    case 1:
                    default:
                        tag.news.push(report);
                        break;
                    case "2":
                    case 2:
                        tag.currents.push(report);
                        break;
                    case "3":
                    case 3:
                        tag.ends.push(report);
                        break;
                }
            });
            tag.list = tag.news;
            tag.update();
        }

        tag.showNews = function()
        {
            tag.list = tag.news;
            tag.update();
        };

        tag.showCurrents = function()
        {
            tag.list = tag.currents;
            tag.update();
        };

        tag.showEnds = function()
        {
            tag.list = tag.ends;
            tag.update();
        };

        tag.showForTarget = function()
        {
            var value = null;
            try
            {
                value = parseInt(tag.refs.target.value);
            }
            catch(e)
            {
                vex.dialog.alert("Vous devez entrer l'identifiant numérique d'un utilisateur.");
                return;
            }
            tag.retrieveReports({
                target_id : value
            });
        }

        tag.showForAuthor = function()
        {
            var value = null;
            try
            {
                value = parseInt(tag.refs.author.value);
            }
            catch(e)
            {
                vex.dialog.alert("Vous devez entrer l'identifiant numérique d'un utilisateur.");
                return;
            }
            tag.retrieveReports({
                author_id : value
            });
        }

        tag.showAll = function()
        {
            tag.retrieveReports();
        }
    </script>
</app-reports>