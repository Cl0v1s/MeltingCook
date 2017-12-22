<app-reporteditform>
    <form name="edit-report">
        <div>
            <label>Motif du signalement</label>
            <textarea name="content" ref="content" value={ report.content }></textarea>
            <p>
                Ce champ doit contenir entre 10 et 1000 caractères.
            </p>
        </div>
        <div if="{ admin == true && report != null }">
            <label>Etat d'avancement</label>
            <select name="state" ref="state">
                <option value="1" selected="{ report.state == 1 || report.state == '1' }">Nouveau</option>
                <option value="2" selected="{ report.state == 2 || report.state == '2' }">En cours</option>
                <option value="3" selected="{ report.state == 3 || report.state == '3' }">Résolu</option>
            </select>
        </div>
        <div>
            <input type="button" class="large" value="Envoyer" onclick={ send }>
        </div>
    </form>

    <script>
        var tag = this;

        tag.report = null;
        tag.target = null;
        tag.callback = null;
        tag.admin = false;

        tag.on("before-mount", function()
        {
            tag.admin = Login.GetInstance().User().rights >= 2;

            if(tag.opts.report != null)
                tag.report = tag.opts.report;
            if(tag.opts.callback != null)
                tag.callback = tag.opts.callback;
            if(tag.opts.target != null)
                tag.target = tag.opts.target;

            if(tag.callback == null)
                throw new Error("Callback must be set.");

            if(tag.report == null && tag.target == null)
                throw new Error("Target must be set.");
        });

        tag.send = function()
        {
            if(tag.refs.content.value.length < 10 || tag.refs.content.value.length > 1000)
            {
                NotificationManager.showNotification("Le motif du signalement doit comporter entre 10 et 1000 caractères.", "error");
                return;
            }
            var adr = App.Address + "/updatereport";
            var rpt = tag.report;
            if(tag.report == null)
            {
                adr = App.Address + "/addreport";
                rpt = {};
                rpt.target_id = tag.target;
                rpt.author_id = Login.GetInstance().User().id;
                rpt.progress = "1";
            }
            else 
                rpt.progress = tag.refs.state.options[tag.refs.state.selectedIndex].value;
            rpt.content = tag.refs.content.value;
            console.log(rpt);
            var request = App.request(adr, rpt);
            request.then((response) => {
                tag.callback();
            });
            request.catch((error) => {
                        ErrorHandler.alertIfError(error);

            });

        }
    </script>
</app-reporteditform>