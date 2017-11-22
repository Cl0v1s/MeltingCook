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
            if(tag.user == null || tag.user.id === null)
            {
                NotificationManager.showNotification("Félicitation ! Vous êtes désormais un membre de Melting Cook. Vous pouvez vous connecter.", "success");
            }
            else 
            {
                NotificationManager.showNotification("Vos informations ont bien été mises à jour !", "success");
            }
            route("/");
        }
    </script>

</app-useredit>