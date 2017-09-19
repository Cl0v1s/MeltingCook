<app-origineditform>
    <form name="edit-origin">
        <div>
            <label>Intitulé</label>
            <textarea name="fullname" ref="name" value={ origin.name }></textarea>
            <p>
                Ce champ doit contenir entre 6 et 400 caractères.
            </p>
        </div>
        <div>
            <input type="button" class="large" value="Envoyer" onclick={ send }>
        </div>
    </form>

    <script>
        var tag = this;

        tag.origin = null;
        tag.callback = null;

        tag.on("before-mount", function()
        {

            if(tag.opts.origin != null)
                tag.origin = tag.opts.origin;
            if(tag.opts.callback != null)
                tag.callback = tag.opts.callback;

            if(tag.callback == null)
                throw new Error("Callback must be set.");
        });

        tag.send = function()
        {
            if(tag.refs.name.value.length <6 || tag.refs.name.value.length > 400)
            {
                vex.dialog.alert("L'intitulé de l'origine doit comporter entre 6 et 400 caractères.");
                return;
            }
            var adr = App.Address + "/updateorigin";
            var rpt = tag.origin;
            if(tag.origin == null)
            {
                adr = App.Address + "/addorigin";
                rpt = {};
            }
            rpt.name = tag.refs.name.value;
            var request = App.request(adr, rpt);
            request.then((response) => {
                tag.callback();
            });
            request.catch((error) => {
                        ErrorHandler.alertIfError(error);

            });

        }
    </script>
</app-origineditform>