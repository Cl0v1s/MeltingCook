<app-login>
    <form name="login">
        <div>
            <label for="username">Utilisateur</label>
            <input type="text" ref="username" name="username" id="username">
        </div>
        <div>
            <label for="password">Mot de passe</label>
            <input type="password" ref="password" name="password" id="password">
        </div>
        <input type="button" class="large" value="Envoyer" onclick='{ send }'>
        <a onclick="{ resetPassword }">J'ai oublié mon mot de passe</a>
    </form>
    <script>
        var tag = this;

        tag.callback = null;

        tag.on("before-mount", function()
        {
            tag.callback = tag.opts.callback;
            if(tag.callback == null)
                throw new Error("Callback cant be null.");
        });

        tag.resetPassword = function()
        {
            var callback = function () {
                App.hidePopUp();
                NotificationManager.showNotification("Votre mot de passe va être modifié. Veuillez allez recevoir un mail de confirmation. Veuillez vous reconnecter.", "success");
                route("/login");
            };

            App.showPopUp("app-resetpasswordform", "J'ai oublié mon mot de passe", {
                "callback": callback
            });
        };

        tag.send = function () {
            var valid = new Validatinator({
                "login": {
                    "username": "required|minLength:1|maxLength:100",
                    "password": "required|minLength:1|maxLength:100",
                }
            });
            if (valid.passes("login")) {
                var auth = Login.GetInstance().auth(tag.refs.username.value, tag.refs.password.value);
                auth.then((user) =>
                {
                    tag.callback();
                });
            }
            if(valid.fails("login"))
            {
                App.diagnosticForm("login", valid.errors);
            }
        };
    </script>
</app-login>