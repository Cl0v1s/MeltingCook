<app-usereditform>
    <form name="edit-user" class={ invisible : user==null }>
        <div class="left">
            <div class="banner">
                <div class="img" ref="banner_preview" style="background-image: url('{ user.banner }');"></div>
                <div>
                    <label>Télécharger une bannière:</label>
                    <input type="text" name="banner" ref="banner" value={ user.banner } onchange={ updateBanner }>
                    <p>
                        Les dimensions recommandées pour un résultat optimal sont 1500 x 500 pixels
                    </p>
                </div>
            </div>
            <div class="picture">
                <div class="img" ref="picture_preview" style="background-image: url('{ user.picture }');"></div>
                <div>
                    <label>Télécharger une photo de profil:</label>
                    <input type="text" name="picture" ref="picture" value={ user.picture } onchange={ updatePicture }>
                    <p>
                        Les dimensions recommandées pour un résultat optimal sont 400 x 400 pixels
                    </p>
                </div>
            </div>
        </div>


        <div class="right">
            <div class="base">
                <div class={ invisible: user.id != null }>
                    <label>Nom d'utilisateur: </label>
                    <input type="text" name="username" ref="username" value={ user.username }>
                    <p>Vous ne pourrez plus changer de nom d'utilisateur après l'inscription. Choisissez avec sagesse.</p>
                </div>
                <div class={ invisible: user.id != null }>
                    <label>Mot de passe: </label>
                    <input type="password" name="password" ref="password">
                </div>
                <div class={ invisible: user.id != null }>
                    <label>Confirmation mot de passe: </label>
                    <input type="password" name="password_confirm" ref="password_confirm">
                </div>
                <div>
                    <label>Age: </label>
                    <input type="text" name="age" ref="age" value={ user.age }>
                </div>
                <div>
                    <label>Numéro de téléphone:</label>
                    <input type="text" name="phone" ref="phone" value={ user.phone }>
                </div>
                <div>
                    <label>Adresse Email associée au compte Paypal:</label>
                    <input type="text" name="mail" ref="mail" value={ user.mail }>
                        <p>Pensez à vérifier qu'il s'agit bien de l'adresse email associée à votre compte Paypal. Nous allons
                            l'utiliser pour vous verser votre dû.</p>
                </div>
                <div>
                    <label>Présentation: </label>
                    <textarea name="description" ref="description">
                    { user.description }
                </textarea>
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
        </div>


        <div class="left">
            <div class={action : true, invisible: (user.id==null) }>
                <input type="button" class="large" value="Voir mon profil" onclick={ details }>
                <input type="button" class="large" value="Réinitialiser mon mot de passe" onclick={ changePassword }>
                <!--<input type="button" class="large" value="Me désinscrire" onclick={ removeAccount }>-->
            </div>
        </div>


        <div class="right">
            <div class="submit">
                <input type="button" class="large" value="Enregistrer" onclick={ send }>
            </div>
        </div>

    </form>

    <script>
        var tag = this;

        tag.user = tag.opts.user;
        tag.callback = tag.opts.callback;
        tag.position = null;

        tag.on("mount", function()
        {
            tag.geolocalize();
        });

        tag.setUser = function (user) {
            tag.user = user;
            tag.update();
        }

        tag.changePassword = function () {
            var callback = function () {
                App.hidePopUp();
                vex.dialog.alert("Votre mot de passe va être modifié. Veuillez allez recevoir un mail de confirmation. Veuillez vous reconnecter.");
                route("/login");
            };

            App.showPopUp("app-userpasswordform", "Modifier votre mot de passe", {
                "callback": callback,
                "user": tag.user
            });
        }

        /*tag.removeAccount = function()
        {
            if(tag.user.id == null)
                return;
            var request = App.request(App.Address + "/removeuser", { id : tag.user.id }, true);
            vex.dialog.alert("Votre compte va être supprimé. Vous allez recevoir un mail de confirmation.");
            route("/home");
        }*/

        tag.details = function()
        {
            if(tag.user != null && tag.user.id != null)
                route("/user/"+tag.user.id);
        }

        tag.geolocalize = function()
        {
            var exec = function(position)
            {
                tag.position = position.coords.latitude+","+position.coords.longitude;
            };
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(exec);
            } else {
                vex.dialog.alert("Vous devez activer la géolocalisation pour être en mesure d'utiliser Melting Cook.");
                tag.geolocalize();
            }
        }

        tag.updatePicture = function()
        {
            tag.refs.picture_preview.style.backgroundImage = "url('"+tag.refs.picture.value+"')";
        }

        tag.updateBanner = function()
        {
            tag.refs.banner_preview.style.backgroundImage = "url('"+tag.refs.banner.value+"')";
        }

        tag.send = function () {
            var valid = new Validatinator({
                "edit-user": {
                    "banner": "maxLength:400",
                    "username": "required|minLength:5|maxLength:400",
                    "age": "required|number|maxLength:3",
                    "phone": "required|minLength:10|maxLength:400",
                    "mail": "required|email|maxLength:400",
                    "description": "required|minLength:50|maxLength:1000",
                    "picture": "maxLength:400",
                    "preference": "maxLength:1000",
                    "discease": "maxLength:1000",
                    "pins": "maxLength:1000"
                }
            });
            if (valid.passes("edit-user")) {

                // Confirmation des mots de passe
                if(tag.user.id == null)
                {
                    if(tag.refs.password.value == "" || tag.refs.password.value.length < 8 || tag.refs.password.value.length > 100)
                    {
                        vex.dialog.alert("Un mot de passe est requis. Il doit contenir entre 8 et 100 caractères.");
                        return;
                    }
                    if(tag.refs.password.value != tag.refs.password_confirm.value)
                    {
                        vex.dialog.alert("Le mot de passe et sa confirmation ne correspondent pas.");
                        return;
                    }
                }
                // Confirmation de la géolocalisation
                if(tag.position == null || tag.position.indexOf(",") == -1)
                {
                    vex.dialog.alert("L'usage de Melting Cook requiert la connaissance de votre position. Veuillez activer la géolocalisation.");
                    return;
                }


                var usr = tag.user;
                if (usr.id == null)
                    usr = {};
                if(tag.user.id == null)
                {
                    usr.password = md5(tag.refs.password.value);
                }
                usr.geolocation = tag.position;
                usr.banner = tag.refs.banner.value;
                if(usr.id == null)
                {
                    usr.username = tag.refs.username.value;
                }
                usr.age = tag.refs.age.value;
                usr.phone = tag.refs.phone.value;
                usr.mail = tag.refs.mail.value;
                usr.description = tag.refs.description.value;
                usr.picture = tag.refs.picture.value;
                usr.preference = tag.refs.preference.value;
                usr.discease = tag.refs.discease.value;
                usr.pins = tag.refs.pins.value;

                var url = App.Address + "/adduser";
                if (usr.id != null)
                    url = App.Address + "/updateuser";

                
                var request = App.request(url, usr);
                request.then((response) => {
                        tag.callback();
                });
                request.catch((error) => {
                    if(error instanceof Error)
                    {
                        vex.dialog.alert(error.message);
                    }
                });
            } else {
                vex.dialog.alert("Le formulaire n'est pas valide en l'état.");
            }
        }
    </script>
</app-usereditform>