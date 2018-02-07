<app-userpasswordform>
    <form name="edit-userpassword">
        <div>
            <label>Votre nouveau mot de passe:</label>
            <input type="password" name="password" ref="password">
        </div>

        <div>
            <label>Confirmation du nouveau mot de passe:</label>
            <input type="password" name="password_confirm" ref="password_confirm">
        </div>

        <center><input type="button" value="Envoyer" onclick={ send }></center>
    </form>
    <script>
        var tag = this;

        tag.user = tag.opts.user;
        tag.callback = tag.opts.callback;

        tag.on("before-mount", function()
        {
            if(tag.user == null || tag.callback == null)
            {
                throw new Error("User and callback must be set.");
            }
        });

        tag.send = function()
        {
           var valid = new Validatinator({
                "edit-userpassword": {
                    "password": "required|minLength:8|maxLength:100",
                    "password_confirm" : "required|minLength:8|maxLength:100"
                }
            });
            if (valid.passes("edit-userpassword")) {
                if(tag.refs.password.value != tag.refs.password_confirm.value)
                {
                    vex.dialog.alert("Les mots de passe ne correspondent pas.");
                    return;
                }
                var request = App.request(App.Address + "/updateuser", {
                  "id" : tag.user.id,
                  "password" : md5(tag.refs.password.value),
                }, true);
                tag.callback();
            }
            else 
            {
                vex.dialog.alert("Le formulaire n'est pas valide en l'état.");
            } 
        }

    </script>
</app-userpasswordform>