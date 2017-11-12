<app-usereditform>
    <form name="edit-user" if={ user != null }>
        <div>
            <h1>Création/Edition d'un compte utilisateur</h1>
        </div>
        <div>
            <h2>Présentation du compte</h2>
            <div class="banner">
                <div class="img" ref="banner_preview" style="background-image: url('{ user.banner }');"></div>
                <div>
                    <label>Télécharger une bannière:</label>
                    <input type="text" name="banner" ref="banner" value={ user.banner } onchange={ updateBanner }>
                    <p class="hint">
                        Ce champ doit contenir une adresse URL valide.
                    </p>
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
                    <p class="hint">
                        Ce champ doit contenir une adresse URL valide.
                    </p>
                    <p>
                        Les dimensions recommandées pour un résultat optimal sont 400 x 400 pixels
                    </p>
                </div>
            </div>
        </div>


        <div>
            <h2>Informations de base</h2>
            <div class="base">
                <div class='{ invisible: user.id != null }'>
                    <label>Nom d'utilisateur: </label>
                    <input type="text" name="username" ref="username" value={ user.username }>
                    <p class="hint">Ce champ doit contenir entre 5 et 400 caractères.</p>
                    <p>
                    Vous ne pourrez plus changer de nom d'utilisateur après l'inscription. Choisissez avec sagesse.</p>
                </div>
                <div class='{ invisible: user.id != null }'>
                    <label>Mot de passe: </label>
                    <input type="password" name="password" ref="password">
                    <p class="hint">
                        Ce champ doit contenir entre 8 et 100 caractères.<br>
                        Le mot de passe et sa confirmation doivent correspondre.
                    </p>
                </div>
                <div class='{ invisible: user.id != null }'>
                    <label>Confirmation mot de passe: </label>
                    <input type="password" name="password_confirm" ref="password_confirm">
                    <p class="hint">
                        Ce champ doit contenir entre 8 et 100 caractères.<br>
                        Le mot de passe et sa confirmation doivent correspondre.
                    </p>
                </div>
                <div>
                    <label>Age: </label>
                    <input type="text" name="age" ref="age" value={ user.age }>
                    <p class="hint">
                        Ce champ doit contenir une valeur numérique comprise entre 0 et 100.
                    </p>
                </div>
                <div>
                    <label>Numéro de téléphone:</label>
                    <input type="text" name="phone" ref="phone" value={ user.phone }>
                    <p class="hint">
                        Ce champ doit contenir un numéro de téléphone valide.
                    </p>
                </div>
            </div>
        </div>
        <div>
            <div class="bills">
                <h2>Informations de facturation</h2>
                <div>
                    <label>Adresse Email associée au compte Paypal:</label>
                    <input type="text" name="mail" ref="mail" value={ user.mail }>
                    <p class="hint">Ce champ doit contenir une adresse email valide.</p>
                    <p>Pensez à vérifier qu'il s'agit bien de l'adresse email associée à votre compte Paypal. Nous allons
                        l'utiliser pour vous verser votre dû.</p>
                </div>
                <div>
                    <label>Présentation: </label>
                    <textarea name="description" ref="description">
                    { user.description }
                    </textarea>
                    <p class="hint">
                        Ce champ doit contenir entre 50 et 1000 caractères.
                    </p>
                </div>
                                <div>
                    <label>Adresse:</label>
                    <input type="text" name="address" ref="address" value={ user.address }>
                    <p class="hint">
                        Ce champ doit contenir votre adresse de facturation.
                    </p>
                </div>
                <div>
                    <label>Prénom:</label>
                    <input type="text" name="firstname" ref="firstname" value={ user.firstname }>
                    <p class="hint">
                        Ce champ doit contenir le prénom qui sera utilisé sur les factures.
                    </p>
                </div>
                <div>
                    <label>Nom:</label>
                    <input type="text" name="lastname" ref="lastname" value={ user.lastname }>
                    <p class="hint">
                        Ce champ doit contenir le nom qui sera utilisé sur les factures.
                    </p>
                </div>
            </div>
        </div>
        <div>
            <div class="more">
                <h2>Détails importants</h2>
                <div>
                    <label>Mes allergies:</label>
                    <div>
                        <input type="text" name="discease" ref="discease" id="discease" value={ user.discease }>
                    </div>
                    <p class="hint">Ce champ ne peut contenir plus de 1000 caractères.</p>
                    <p>
                        Veuillez renseigner les informations relatives à vos éventuelles allergies et contre-indications alimentaires.
                    </p>
                </div>
                <div>
                    <label>Mes inspirations:</label>
                    <app-origininput ref="preference"></app-origininput>
                    <p class="hint">
                        Ce champ ne peut contenir plus de 1000 caractères.
                    </p>
                    <p>
                        Indiquez aux autres utilisateurs quelles sont vos sources d'inspiration alimentaires !
                    </p>
                </div>
                <div>
                    <label>Mes plus:</label>
                    <app-pinsinput ref="pins"></app-pinsinput>
                    <p class="hint">
                        Ce champ ne peut contenir plus de 1000 caractères.
                    </p>
                    <p>
                        Indiquez aux autres utilisateurs vos petit plus !<br>
                        e.g: Bio, Vegan, Sans-gluten, Halal
                    </p>
                </div>
            </div>
        </div>


        <div if="{ user.id != null }">
            <h2>Actions</h2>
            <div class='{action : true, invisible: (user.id==null) }'>
                <input type="button" class="large" value="Réinitialiser mon mot de passe" onclick='{ changePassword }'>
                <!--<input type="button" class="large" value="Me désinscrire" onclick='{ removeAccount }'>-->
            </div>
        </div>


            <div>
                <input type="button" class="large" value="Enregistrer" onclick='{ validate }'>
            </div>

    </form>

    <script>
        var tag = this;

        tag.user = null;
        tag.callback = null;
        tag.position = null;

        tag.on("before-mount", function()
        {
            tag.user = tag.opts.user;
            tag.callback = tag.opts.callback;
        });

        tag.on("mount", function()
        {
            tag.geolocalize();

            $('#discease').selectize({
                    delimiter: ";",
                    persist: true,
                    maxItems: null,
                    valueField: 'name',
                    labelField: 'name',
                    searchField: ['name'],
                    options: [],
                    create: function (input) {
                        return {
                            name: input
                        };
                    },
            });
        });

        tag.on("updated", function()
        {
            if(tag.user != null && tag.user.id != null)
            {
                tag.refs.preference.setValue(tag.user.preference);
                tag.refs.pins.setValue(tag.user.pins);
            }
        });

        tag.setUser = function (user) {
            tag.user = user;
            tag.update();
        };

        tag.changePassword = function () {
            var callback = function () {
                App.hidePopUp();
                NotificationManager.showNotification("Votre mot de passe va être modifié. Veuillez allez recevoir un mail de confirmation. Veuillez vous reconnecter.", "success");
                route("/login");
            };

            App.showPopUp("app-userpasswordform", "Modifier votre mot de passe", {
                "callback": callback,
                "user": tag.user
            });
        };

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
        };

        tag.geolocalize = function()
        {
            var exec = function(position)
            {
                tag.position = position.coords.latitude+","+position.coords.longitude;
            };
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(exec);
            } else {
                NotificationManager.showNotification("Vous devez activer la géolocalisation pour être en mesure d'utiliser Melting Cook.", "error");
                tag.geolocalize();
            }
        };

        tag.updatePicture = function()
        {
            tag.refs.picture_preview.style.backgroundImage = "url('"+tag.refs.picture.value+"')";
        };

        tag.updateBanner = function()
        {
            tag.refs.banner_preview.style.backgroundImage = "url('"+tag.refs.banner.value+"')";
        };

        tag.validate = function () {
            var valid = new Validatinator({
                "edit-user": {
                    "banner": "maxLength:400",
                    "username": "required|minLength:5|maxLength:400",
                    "age": "required|number|maxLength:3",
                    "phone": "required|minLength:10|maxLength:400",
                    "mail": "required|email|maxLength:400",
                    "description": "required|minLength:50|maxLength:1000",
                    "picture": "maxLength:400",
                    "discease": "maxLength:1000",
                    "lastname": "required|maxLength:400",
                    "firstname": "required|maxLength:400",
                    "address": "required|maxLength:1000",
                }
            });
            if (valid.passes("edit-user")) {
                // Validation des valeurs custom
                var errors = {
                    "edit-user" : {}
                };
                // Confirmation des mots de passe
                if(tag.user.id == null)
                {
                    if(tag.refs.password.value == "" || tag.refs.password.value.length < 8 || tag.refs.password.value.length > 100)
                    {
                        errors["edit-user"].password = {
                            "required" : "true"
                        };
                    }
                    if(tag.refs.password.value != tag.refs.password_confirm.value)
                    {
                        errors["edit-user"].password = {
                            "required" : "true"
                        };
                    }
                }
                // COnfirmation du numéro de téléphone
                if(/^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/.test(tag.refs.phone.value) == false)
                {
                    errors["edit-user"].phone = {
                        "required" : "true"
                    };
                }

                // Confirmation de la géolocalisation
                if(tag.position == null || tag.position.indexOf(",") == -1)
                {
                    NotificationManager.showNotification("Vous devez activer la géolocalisation pour être en mesure d'utiliser Melting Cook.", "error");
                    tag.geolocalize();
                    return;
                }
                //Confirmation des préference
                if(tag.refs.preference.value == null && tag.refs.preference.value > 1000)
                {
                    errors["edit-user"].preference = {
                        "required" : "true"
                    };
                }
                //Confirmation des pins
                if(tag.refs.pins.value == null && tag.refs.pins.value > 1000)
                {
                    errors["edit-user"].pins = {
                        "required" : "true"
                    };
                }
                if(Object.keys(errors["edit-user"]).length > 0)
                {
                    App.diagnosticForm("edit-user", errors);
                    return;
                }
                tag.send();
            }
            if(valid.fails("edit-user"))
            {
                App.diagnosticForm("edit-user", valid.errors);
            }
        }

        tag.send = function()
        {

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
            usr.lastname = tag.refs.lastname.value;
            usr.firstname = tag.refs.firstname.value;
            usr.address = tag.refs.address.value;

            var url = App.Address + "/adduser";
            if (usr.id != null)
                url = App.Address + "/updateuser";


            var request = App.request(url, usr);
            request.then((response) => {
                Login.GetInstance().setUser(usr);
                tag.callback();
            });
            request.catch((error) => {
                ErrorHandler.alertIfError(error);

            });
        }
    </script>
</app-usereditform>