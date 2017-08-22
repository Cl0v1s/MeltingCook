<app-reservation>
    <app-header></app-header>
    <div class="content">
        <section>
            <h1>Récapitulatif de cuisine</h1>
            <div>
                <div>
                    <label>Qui cuisine ?</label>
                    <app-useritem user="{ recipe.user }"></app-useritem>
                </div>
                <div>
                    <label>Qui participe ?</label>
                    <table>
                        <tr each="{ guest in recipe.guests }">
                            <td>{ guest.username }</td>
                            <td><a onclick="{ userDetails }" data-id="{ guest.id }">Voir le profil</a></td>
                        </tr>
                    </table>
                    <div class="guests" if="{ recipe.guests.length <= 0 }">
                        Vous etes le seul participant pour le moment.
                    </div>
                </div>
                <div class="recipe">
                    <label>Apprentissage de:</label>
                    <app-recipeitem recipe="{ recipe }"></app-recipeitem>
                </div>
            </div>
        </section>

        <section>
            <h1>Faisons les comptes</h1>
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
        </section>

        <section>
            <h1>Paiement en ligne par Paypal</h1>
            <div class="checkout">
                <p>Vous allez pouvoir accéder à Paypal pour finaliser votre paiement.</p>
                <input type="button" value="Payer { recipe.price+2 }€" onclick="{ paypal }">
                <p>En validant le paiement, vous accepter les CGU et la charte de bonne conduite de Melting Cook.</p>
            </div>
        </section>
    </div>
    <app-footer></app-footer>

    <script>
        var tag = this;

        tag.recipe = null;

        tag.on("before-mount", function()
        {
            tag.recipe = Adapter.adaptRecipe(tag.opts.recipe);
            if(tag.recipe == null)
                throw new Error("Recipe cant be null.");
        });

        tag.paypal = function()
        {
            vex.dialog.alert("Not Implemented");
        };

        tag.userDetails = function(e)
        {
            var id = e.target.getAttribute("data-id");
            route("/user/"+id);
        }
    </script>
</app-reservation>