<app-pineditform>
    <form name="edit-pin">
        <div>
            <label>Intitulé</label>
            <textarea name="fullname" ref="name" value={ pin.name }></textarea>
            <p>
                Ce champ doit contenir entre 4 et 400 caractères.
            </p>
        </div>
        <div>
            <input type="button" class="large" value="Envoyer" onclick={ send }>
        </div>
    </form>

    <script>
        var tag = this;

        tag.pin = null;
        tag.callback = null;

        tag.on("before-mount", function()
        {

            if(tag.opts.pin != null)
                tag.pin = tag.opts.pin;
            if(tag.opts.callback != null)
                tag.callback = tag.opts.callback;

            if(tag.callback == null)
                throw new Error("Callback must be set.");
        });

        tag.send = function()
        {
            if(tag.refs.name.value.length <4 || tag.refs.name.value.length > 400)
            {
                vex.dialog.alert("L'intitulé du Plus doit comporter entre 4 et 400 caractères.");
                return;
            }
            var adr = App.Address + "/updatepins";
            var rpt = tag.pin;
            if(tag.pin == null)
            {
                adr = App.Address + "/addpins";
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
</app-pineditform>