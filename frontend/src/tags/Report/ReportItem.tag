<app-reportitem>
    <div class="identity">
        <span><b>Par:</b> <a target="_blank" href="#/user/{report.author.id}">{ report.author.username }</a></span>
        <span><b>Concerne:</b> <a target="_blank" href="#/user/{report.target.id}">{ report.target.username}</a></span>
    </div>
    <div class="body">
        <div>
            <span><b>Etat:</b> { report.message_state }</span>
        </div>
        <p>
            { report.content }
        </p>
    </div>
    <div class="foot">
        <input type="button" class="large" value="Mettre à jour" onclick={ edit }>
    </div>

    <script>
        var tag = this;

        tag.report = null;

        tag.on("before-mount", function()
        {
            tag.report = Adapter.adaptReport(tag.opts.report);

            if(tag.report == null)
                throw new Error("Report cant be null");
        });

        tag.author = function()
        {
            if(tag.report.author != null && tag.report.author.id != null)
                route("/user/"+tag.report.author.id);
        }

        tag.target = function()
        {
            if(tag.report.target != null && tag.report.target.id != null)
                route("/user/"+tag.report.target.id);
        }

        tag.edit = function()
        {
            var callback = function()
            {
                App.hidePopUp();
                vex.dialog.alert("Le signalement a bien été mis à jour.");
            }
            App.showPopUp("app-reporteditform", "Mise à jour d'un signalement", { "callback" : callback, "report" : tag.report});
        }
    </script>
</app-reportitem>