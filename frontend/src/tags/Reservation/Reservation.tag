<app-reservation>
    <app-header></app-header>
    <div class="content">
        <div>
            <h1>RECAPITULATIF DE CUISINE</h1>
            <div>
                <div>
                    <label>Qui cuisine ?</label>
                    <app-useritem user="{ recipe.user }"></app-useritem>
                </div>
                <div>
                    <label>Qui participe ?</label>
                    <app-users users="{ recipe.guests }"></app-users>
                </div>
                <div>
                    <label>Apprentissage de:</label>
                    <app-recipeitem recipe="{ recipe }"></app-recipeitem>
                </div>
            </div>
        </div>

        <div>
            <h1>FAISONS LES COMPTES</h1>
            <div>
                <table>
                    <tr>
                        <td>
                            1x Assiette
                        </td>
                        <td>
                            { recipe.price }€
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Frais de réservation
                        </td>
                        <td>
                            2€
                        </td>
                    </tr>
                    <tr>
                        <td>
                            TOTAL
                        </td>
                        <td>
                            { recipe.price+2 }€
                        </td>
                    </tr>

                </table>
            </div>
        </div>

        <div>
            <h1>PAIEMENT EN LIGNE PAR PAYPAL</h1>
            <div>
                <p>Vous allez pouvoir accéder à Paypal pour finaliser votre paiement.</p>
                <input type="button" value="Payer { recipe.price+2 }€" onclick="{ paypal }">
                <p>En validant le paiement, vous accepter les CGU et la charte de bonne conduite de Melting Cook.</p>
            </div>
        </div>
    </div>
    <app-footer></app-footer>

    <script>
        var tag = this;

        tag.paypal = function()
        {
            vex.dialog.alert("Not Implemented");
        };
    </script>
</app-reservation>