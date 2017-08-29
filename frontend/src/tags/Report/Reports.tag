<app-reports>
    <div>
        <nav>
            <a onclick={ showNews }>Nouveaux</a>
            <a onclick={ showCurrents }>En cours</a>
            <a onclick={ showEnds }>Terminés</a>
        </nav>

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
                throw new Error("Reports cant be null.");
            tag.sortReports();
        });

        tag.sortReports = function () {
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
        };

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