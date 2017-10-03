<app-reservations>
    <div class="SwitchHandler">
        <br><br>
        <span class="Switch">
                <a onclick='{ showDone }' class="{ selected : list == done }">A Verser</a>
                <a onclick='{ showRefunds }' class="{ selected :  list == refunds }">A Rembourser</a>
        </span>
        <br><br>
    </div>
    <table>
        <thead>
            <tr>
                <td>Identifiant</td>
                <td>Hôte</td>
                <td>Invité</td>
                <td>Montant</td>
                <td>Action</td>
            </tr>
        </thead>
        <tbody>
            <tr each="{ reservation in list }" name="reservation-{ reservation.id }">
                <td>{ reservation.id }</td>
                <td>{ reservation.host.mail }</td>
                <td>{ reservation.guest.mail }</td>
                <td>{ reservation.recipe.price }</td>
                <td>
                    <input type="button" value="Marquée comme terminée" data-id="{ reservation.id }" onclick="{ finish }">
                </td>
            </tr>
        </tbody>
    </table>
    <script>
        var tag = this;

        tag.admin = false;
        tag.reservations = null;

        tag.list = null;

        tag.done = null;
        tag.refunds = null;

        tag.on("before-mount", function()
        {
            tag.reservations = tag.opts.reservations;
            if(tag.opts.admin != null)
                tag.admin = tag.opts.admin;
            if(tag.reservations == null)
                throw new Error("Reservations cant be null.")

            tag.sortReservations();

        });

        tag.sortReservations = function()
        {
            tag.done = [];
            tag.refunds = [];

            tag.reservations.forEach((res) => {
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
            });

            tag.list = tag.done;
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

        tag.finish = function(e)
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
                            let tr = tag.root.querySelector("tr[name=reservation-"+id+"]");
                            tr.remove();
                        });
                        request.catch(function(error){
                           ErrorHandler.alertIfError(error);
                        });
                    }
                }
            })
        }


    </script>
</app-reservations>