<app-reportformedit>
    <form name="edit-report">
        <div>
            <label>Motif du signalement</label>
            <textarea name="content" ref="content" value={ report.content }></textarea>
        </div>
        <div class={ invisible : admin == false }>
            <label>Etat d'avancement</label>
            <select name="state" ref="state">
                <option value="0" selected={ report.state == 0 || report.state == "0" }>Nouveau</option>
                <option value="1" selected={ report.state == 1 || report.state == "1" }>En cours</option>
                <option value="2" selected={ report.state == 2 || report.state == "2" }>Résolu</option>
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
        });

        tag.send = function()
        {
            if(tag.refs.content.value.length < 10 && tag.refs.content.value.length > 1000)
            {
                vex.dialog.alert("Le motif du signalement doit comporter entre 10 et 1000 caractères.");
                return;
            }
            var adr = App.Address + "/updatereport";
            var rpt = tag.report;
            if(tag.report == null)
            {
                rpt = {};
                adr = App.Address + "/addreport";
            }
            rpt.target_id = tag.target;
            rpt.author_id = Login.GetInstance().User().id;
            rpt.content = tag.refs.content.value;
            rpt.state = tag.refs.state.options[tag.refs.state.selectedIndex].value;
            var request = App.request(adr, rpt);
            request.then((response) => {
                tag.callback();
            });
            request.catch((error) => {
                vex.dialog.alert("Ooops...Une erreur est survenue... Veuillez réessayer plus tard.");
            });

        }
    </script>
</app-reportformedit>