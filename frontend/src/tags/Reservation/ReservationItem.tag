<app-reservationitem>
    <span>Vous pouvez joindre l'hôte au { reservation.recipe.user.phone }</span>
    <app-recipeitem recipe={ reservation.recipe }></app-recipeitem>
    <script>
        var tag = this;

        tag.reservation = null;

        tag.on("before-mount", function()
        {
            tag.reservation = tag.opts.reservation;
        });

        tag.setReservation = function(reservation)
        {
            tag.reservation = reservation;
            tag.update();
        }
    </script>
</app-reservationitem>