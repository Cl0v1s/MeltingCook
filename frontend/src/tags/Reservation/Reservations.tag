<app-reservations>
    <app-reservationitem each={ reservation in reservations} reservation={ reservation }></app-reservationitem>
    <script>
        var tag = this;

        tag.reservations = null;

        tag.on("before-mount", function()
        {
            tag.reservations = tag.opts.reservations;
        });

        tag.setReservations = function(reservations)
        {
            tag.reservations = reservations;
            tag.update();
        }
    </script>
</app-reservations>