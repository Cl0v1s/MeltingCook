<app-reservationvalidateform>
    <h2>
        Merci d'avoir utilisé Melting Cook !
    </h2>
    <p>
        Nous espérons que vous avez appris des choses et passé un bon moment !
    </p>
    <br>
    <p>
        Après cette opération, votre demande de validation sera prise en compte. Votre hôte recevra bientôt sa compensation !<br>
    </p>
    <br>
    <br>
    <h2>Avant de partir, pouvez-vous laisser un avis sur l'accueil que votre hôte vous a réservé ci-dessous ?</h2>
    <app-commenteditform target="{ reservation.host }" author="{ reservation.guest }" callback="{ callback }"></app-commenteditform>

    <script>
        var tag = this;

        tag.reservation = null;
        tag.callback = null;

        tag.on("before-mount", function(){
           tag.reservation = tag.opts.reservation;
           if(tag.reservation == null)
           {
               throw new Error("Reservation cant be null.");
           }
           tag.callback = tag.opts.callback;
        });


    </script>
</app-reservationvalidateform>