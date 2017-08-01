<app-usereditform>
    <form name="edit-user" class={ invisible : user == null }>

        <div class="banner">
            <img src={ user.banner }>
            <div>
                <label>Télécharger une bannière:</label>
                <input type="text" name="banner" ref="banner">
                <p>
                    Les dimensions recommandées pour un résultat optimal sont 1500 x 500 pixels
                </p>
            </div>
        </div>

        <div class="base">
            <div>
                <label>Nom: </label>
                <input type="text" name="username" ref="username" value={ user.username }>
            </div>
            <div>
                <label>Age: </label>
                <input type="text" name="age" ref="age" value={ user.age }>
            </div>
            <div>
                <label>Numéro de téléphone:</label>
                <inut type="text" name="phone" ref="phone" value={ user.phone }>
            </div>
            <div>
                <label>Adresse Email associée au compte Paypal:</label>
                <inut type="text" name="mail" ref="mail" value={ user.mail }>
                <p>Pensez à vérifier qu'il s'agit bien de l'adresse email associée à votre compte Paypal. Nous allons l'utiliser pour vous verser votre dû.</p>
            </div>
            <div>
                <label>Presentation: </label>
                <textarea name="description" ref="description" value={ user.description }>
                </textarea>
            </div>
        </div>

        <div class="picture">
            <img src={ user.picture }>
            <div>
                <label>Télécharger une photo de profil:</label>
                <input type="text" name="picture" ref="picture" value={ user.picture }>
                <p>
                    Les dimensions recommandées pour un résultat optimal sont 400 x 400 pixels
                </p>
            </div>
        </div>

        <div class="more">
            <div>
                <label>Mes allergies:</label>
                <input type="text" name="discease" ref="discease" value={ user.discease }>
            </div>
            <div>
                <label>Mes inspirations:</label>
                <input type="text" name="preference" ref="preference" value={ user.preference }>
            </div>
            <div>
                <label>Mes plus:</label>
                <input type="text" name="pins" ref="pins" value={ user.pins }>
            </div>
        </div>

        <div class="action" class={ invisible: user.id == null }>
            <input type="button" class="large" value="Voir mes avis">
            <input type="button" class="large" value="Réinitialiser mon mot de passe" onclick={ changePassword }>
            <input type="button" class="large" value="Me désinscrire">
        </div>


    </form>

    <script>
        var tag = this;

        tag.user = tag.opts.user;
        tag.callback = tag.opts.callback;

        tag.setUser = function(user)
        {
            tag.user = user;
            tag.update();
        }

        tag.changePassword = function()
        {
            var callback = function()
            {
                App.hidePopUp();
                vex.dialog.alert("Votre mot de passe a bien été mis à jour !");
            };

            App.showPopUp("app-userpasswordform", "Modifier votre mot de passe", {
                "callback" : callback,
                "user" : tag.user
            });
        }

        tag.send = function()
        {
            var valid = new Validatinator({
                "edit-user": {
                    "banner": "maxLength:400|url",
                    "username": "required|minLength:5|maxLength:400",
                    "age": "required|number|maxLength:3",
                    "phone": "required|minLengh:10|maxLength:400",
                    "mail" : "required|email|maxLength:400",
                    "description": "required|minLength:50|maxLength:1000",
                    "picture": "maxLength:400|url",
                    "preference": "maxLength:1000",
                    "discease": "maxLength:1000",
                    "pins": "maxLength:1000"
                }
            });
            if (valid.passes("edit-user")) {
                var usr = tag.user;
                if(usr.id == null)
                    usr = {};
                usr.banner = tag.refs.banner.value;
                usr.username = tag.refs.username.value;
                usr.age = tag.refs.age.value;
                usr.phone = tag.refs.phone.value;
                usr.mail = tag.refs.mail.value;
                usr.description = tag.refs.description.value;
                usr.picture = tag.refs.picture.value;
                usr.preference = tag.refs.preference.value;
                usr.discease = tag.refs.discease.value;
                usr.pins = tag.refs.pins.value;

                var url = App.Address+"/adduser";
                if(usr.id != null)
                    url = App.Address+"/updateuser";

                var request = App.request(url, usr);
                request.then((response) => {
                    tag.callback();
                });
                request.catch((error) => {
                    vex.dialog.alert("Oops... Une erreur est survenue. Veuillez réessayer plus tard.");
                });
            }
            else 
            {
                vex.dialog.alert("Le formulaire n'est pas valide en l'état.");
            }
        }

    </script>
</app-usereditform>