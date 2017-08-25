<app-useredit>
    <app-header ></app-header>
    <div class="content">
        <app-usereditform ref="form" user='{ {} }' callback='{ send }'></app-usereditform>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.send = function()
        {
            if(tag.user.id === null)
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