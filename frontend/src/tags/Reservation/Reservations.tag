<app-reservations>
    <div class="SwitchHandler" if="{ interactive }">
        <br><br>
        <span class="Switch">
                <a onclick='{ showFunds }' class="{ selected :  list == funds }">Provisionnées</a>
                <a onclick='{ showDone }' class="{ selected : list == done }">A Verser</a>
                <a onclick='{ showRefunds }' class="{ selected :  list == refunds }">A Rembourser</a>

        </span>
        <br><br>
    </div>
    <table>
        <thead>
            <tr>
                <td if="{ interactive }">Identifiant</td>
                <td if="{ interactive }">Hôte</td>
                <td>Invité</td>
                <td>Montant</td>
                <td if="{ interactive }">Action</td>
            </tr>
        </thead>
        <tbody>
            <tr each="{ reservation in list }" id="reservation-{ reservation.id }">
                <td if="{ interactive }">{ reservation.id } / { reservation.txn_id }</td>
                <td if="{ interactive }">{ reservation.host.mail }</td>
                <td>{ reservation.guest.mail }</td>
                <td>{ reservation.recipe.price }</td>
                <td if="{ interactive }">
                    <input if="{ admin == true }" type="button" value="Marquer comme terminée" data-id="{ reservation.id }" onclick="{ fullfill }">
                    <input if="{ admin == false && reservation.paid == '1' && reservation.done == '0' && reservation.recipe.date_start <= (new Date().getTime()/1000)  }" type="button" value="Je finalise"  data-id="{ reservation.id }" onclick="{ validate }">
                    <input if="{ admin == false && reservation.paid != '2' && reservation.done != '1' }" type="button" value="J'annule"  data-id="{ reservation.id }" onclick="{ refund }">
                </td>
            </tr>
        </tbody>
    </table>
    <script>
        var tag = this;

        tag.admin = false;
        tag.interactive = true;
        tag.reservations = null;

        tag.list = null;

        tag.done = null;
        tag.refunds = null;
        tag.funds = null;

        tag.on("before-mount", function()
        {
            tag.reservations = tag.opts.reservations;
            if(tag.opts.admin != null)
                tag.admin = tag.opts.admin;
            if(tag.opts.interactive != null)
                tag.interactive = tag.opts.interactive;
            if(tag.reservations == null)
                throw new Error("Reservations cant be null.");

            tag.sortReservations();

        });

        tag.sortReservations = function()
        {
            tag.done = [];
            tag.refunds = [];
            tag.funds = [];

            tag.reservations.forEach((res) => {
                if(res.done == "2" || res.done == 2)
                    return;
                if(res.done == "1")
                {
                    tag.done.push(res);
                    return;
                }

                if(res.paid == "2")
                {
                    tag.refunds.push(res);
                    return;
                }

                if(res.paid == "1")
                    tag.funds.push(res);
            });
            if(tag.admin == true)
                tag.list = tag.done;
            else
                tag.list = tag.funds;
        };

        tag.showRefunds = function()
        {
            tag.list = tag.refunds;
            tag.update();
        };

        tag.showDone = function()
        {
            tag.list = tag.done;
            tag.update();
        };

        tag.showFunds = function()
        {
            tag.list = tag.funds;
            tag.update();
        };

        tag.fullfill = function(e)
        {
            let id = e.target.getAttribute('data-id');
            vex.dialog.confirm({
                message: 'Etes-vous sûr de vouloir marquer cette réservation comme finalisée ? (Cela signifie que vous avez fait le nécessaire via Paypal. )',
                callback: function (value) {
                    if (value) {
                        let request = App.request(App.Address + "/fullfillreservation", {
                            "id" : id
                        });
                        request.then(function(response){
                            tag.reload();
                        });
                        request.catch(function(error){
                           ErrorHandler.alertIfError(error);
                        });
                    }
                }
            });
        };

        tag.validate = function(e)
        {
            let id = e.target.getAttribute('data-id');

            let callback = function()
            {
                let requestvalidate = App.request(App.Address + "/validatereservation", {
                    "id" : id
                });
                requestvalidate.then(function(response){
                    App.hidePopUp();
                    NotificationManager.showNotification("L'attestation a bien été prise en compte. Vous serez informé de l'état d'avancement de votre demande.", "success");
                    tag.reload();
                });
                requestvalidate.catch(function(error){
                    ErrorHandler.alertIfError(error);
                });
            };

            let request = App.request(App.Address+ "/getreservation", {
                "id" : id
            });
            request.then(function(response){
                App.showPopUp("app-reservationvalidateform", "Attestation de la réservation", {
                    "reservation" :  response.data,
                    "callback" : callback
                });
            });
            request.catch(function(error){
               ErrorHandler.alertIfError(error);
            });
        };

        tag.refund = function(e)
        {
            let id = e.target.getAttribute('data-id');
            vex.dialog.confirm({
                message: 'Etes-vous sûr de vouloir annuler cette réservation ? (Si celle-ci a été provisionnée vous serez remboursé selon les conditions Melting Cook.)',
                callback: function (value) {
                    if (value) {
                        let request = App.request(App.Address + "/refundorcancelreservation", {
                            "id" : id
                        });
                        request.then(function(response){
                            tag.reload();
                            NotificationManager.showNotification("L'annulation a bien été prise en compte. Vous serez informé de l'état d'avancement de votre demande.", "success");
                        });
                        request.catch(function(error){
                            ErrorHandler.alertIfError(error);
                        });
                    }
                }
            })
        };

        tag.reload = function()
        {
            let request = App.request(App.Address + "/getreservations", null);
            request.then(function(response){
                tag.reservations = response.data;
                tag.sortReservations();
                tag.update();
            });
            request.catch(function(error){
               ErrorHandler.alertIfError(error);
            });
        };


    </script>
</app-reservations>