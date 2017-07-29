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
        <input type="button" value="Envoyer" onclick={ send }>
    </form>
    <script>
        var tag = this;

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
                    route("/");
                });
                /*auth.catch((error) => {
                
                });*/
            }
            else 
                vex.dialog.alert("Le formulaire n'est pas valide en l'état.");
        };
    </script>
</app-login>