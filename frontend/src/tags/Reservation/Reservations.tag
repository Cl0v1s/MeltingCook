<app-reservations>
    <div class="SwitchHandler">
        <br><br>
        <span class="Switch">
                <a onclick='{ showCurrents }' class="{ selected : list == currents }">En Cours</a>
                <a onclick='{ showDone }' class="{ selected : list == done }">A Verser</a>
                <a onclick='{ showRefunds }' class="{ selected :  list == refunds }">A Rembourser</a>
                <a onclick='{ showOthers }' class="{ selected :  list == others }">Autre</a>
        </span>
        <br><br>
    </div>
    <app-reservationitem each={ reservation in list } reservation={ reservation }></app-reservationitem>
    <script>
        var tag = this;

        tag.admin = false;
        tag.reservations = null;

        tag.list = null;

        tag.done = null;
        tag.currents = null;
        tag.refunds = null;
        tag.others = null;

        tag.on("before-mount", function()
        {
            tag.reservations = tag.opts.reservations;
            if(tag.opts.admin != null)
                tag.admin = tag.opts.admin;
            if(tag.reservations == null)
                throw new Error("Reservations cant be null.")

            tag.sortReservations();

        });

        tag.setReservations = function(reservations)
        {
            tag.reservations = reservations;
            tag.update();
        }

        tag.sortReservations = function()
        {
            tag.done = [];
            tag.refunds = [];
            tag.currents = [];
            tag.others = [];

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

                if(res.paid == "1" && res.done == "0")
                {
                    tag.currents.push(res);
                    return;
                }

                tag.others.push(res);
            });

            console.log(tag.done);
            console.log(tag.refunds);
            console.log(tag.currents);
            console.log(tag.others);

            tag.list = tag.currents;
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

        tag.showCurrents = function()
        {
            tag.list = tag.currents;
            tag.update();
        };

        tag.showOthers = function()
        {
            tag.list = tag.others;
            console.log(tag.list);
            tag.update();
        };
    </script>
</app-reservations>