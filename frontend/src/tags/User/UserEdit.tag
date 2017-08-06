<app-useredit>
    <app-header ></app-header>

    <app-usereditform ref="form" user={ user } callback={ send }></app-usereditform>

    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.user = null;

        tag.on("before-mount", function()
        {
            tag.user = tag.opts.user;
        });

        tag.on("mount", function()
        {
            if(tag.user == null && tag.opts.pass != null)
                tag.retrieveUser(tag.opts.pass);
            else 
            {
                tag.user = {};
                tag.refs.form.setUser(tag.user);
            }
        });

        tag.retrieveUser = function(id)
        {
            var request = App.request(App.Address + "/getuser", {
                "id" : id
            });
            request.then((response) => {
                tag.user = response.data;
                tag.refs.form.setUser(tag.user);
            });
            request.catch((error) => {
    
            });
        }


        tag.send = function()
        {
            if(tag.user.id == null)
            {
                vex.dialog.alert("Félicitation ! Vous êtes désormais un membre de Melting Cook. Vous pouvez vous connecter.");
            }
            else 
            {
                vex.dialog.alert("Vos informations ont bien été mises à jour !");
            }
            route("/");
        }



    </script>

</app-useredit>