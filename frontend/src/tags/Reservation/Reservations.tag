<app-reservations>
    <div if={ admin }>
        <div>
            <label>Chercher par hôte</label>
            <input type="number" ref="host"><input type="button" value="Afficher" onclick={ showForHost }>
        </div>
        <div>
            <label>Chercher par invité</label>
            <input type="number" ref="guest"><input type="button" value="Afficher" onclick={ showForGuest }>
        </div>
        <div>
            <input type="button" value="Tout Afficher" onclick={ showAll }>
        </div>
    </div>
    <app-reservationitem each={ reservation in reservations} reservation={ reservation }></app-reservationitem>
    <script>
        var tag = this;

        tag.admin = false;
        tag.reservations = null;

        tag.on("before-mount", function()
        {
            tag.reservations = tag.opts.reservations;
            if(tag.opts.admin != null)
                tag.admin = tag.opts.admin;
            if(tag.reservations == null)
                tag.retrieveReservations();
        });

        tag.retrieveReservations = function(filters = null)
        {
            var data = {};
            if(filters != null)
                data.filters = JSON.stringify(filters);
            var request = App.request(App.Address + "/getreservations", data);
            request.then((response) => {
                    tag.setReservations(response.data);
            });
            request.catch((error) => {
                ErrorHandler.alertIfError(error);
            });
        }

        tag.showForHost = function()
        {
            var value = null;
            try
            {
                value = parseInt(tag.refs.host.value);
            }
            catch(e)
            {
                vex.dialog.alert("Vous devez entrer l'identifiant numérique d'un utilisateur.");
                return;
            }
            tag.retrieveReservations({
                host_id : value
            });
        }

        tag.showForGuest = function()
        {
            var value = null;
            try
            {
                value = parseInt(tag.refs.host.value);
            }
            catch(e)
            {
                vex.dialog.alert("Vous devez entrer l'identifiant numérique d'un utilisateur.");
                return;
            }
            tag.retrieveReservations({
                guest_id : value
            });
        }

        tag.setReservations = function(reservations)
        {
            tag.reservations = reservations;
            tag.update();
        }
    </script>
</app-reservations>