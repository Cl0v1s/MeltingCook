<app-resetpasswordform>
    <form name="reset">
        <p>
            Veuillez entrer ci-dessous l'adresse email de votre compte. Nous vous enverrons un mail contenant un lien permettant de regénérer votre mot de passe.
        </p>
        <div>
            <label for="email">Addresse email de votre compte</label>
            <input type="text" ref="email" name="email" id="email">
        </div>
        <input type="button" class="large" value="Envoyer" onclick='{ validate }'>
    </form>
    <script>
        var tag = this;

        tag.callback = null;

        tag.on("before-mount", function(){
            tag.callback = tag.opts.callback;
        });

        tag.validate = function()
        {
            var valid = new Validatinator({
                "reset": {
                    "email": "required|minLength:1|maxLength:100",
                }
            });
            if (valid.passes("reset")) {
                tag.send();
            }
            if(valid.fails("reset"))
            {
                App.diagnosticForm("reset", valid.errors);
            }
        };

        tag.send = function()
        {
            let request = App.request(App.Address + "/beginresetpassword", {
                "email" : tag.refs.email.value
            });
            request.then(function(response){
                NotificationManager.showNotification("Nous vous avons envoyé un email contenant un lien vous permettant de regénérer votre mot de passe.", "success");
                if(tag.callback != null)
                    tag.callback();
            });
            request.catch(function(error){
                if(error instanceof Error)
                    ErrorHandler.alertIfError(error);
            });
        };
    </script>

</app-resetpasswordform>