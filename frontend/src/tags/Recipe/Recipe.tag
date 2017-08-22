<app-recipe>
    <app-header></app-header>

    <div>
        <div class="banner" style="background-image: url('{ recipe.picture }');"></div>
        <!-- Présentation des informations sur la recette-->
        <div class="content">
            <div class="infos">
                <div class="base">
                    <div class="name">
                        <h1>{ recipe.name }</h1>
                        <div>
                            <div class="Pins open" each='{ p in recipe.pins }'>{ p }</div>
                        </div>
                    </div>
                    <div class="description">
                        <p>
                            { recipe.description }
                        </p>
                    </div>
                </div>

                <div class="geolocation">
                    <app-placehint latitude={ recipe.latitude } longitude={ recipe.longitude} place={ recipe.place
                                   }></app-placehint>
                </div>

                <div class="details">
                    <h2>Ingédients :</h2>
                    <ul>
                        <li each={ item in recipe.items }>{ item }</li>
                    </ul>
                </div>

                <div class="users">
                    <app-users users={ recipe.users }></app-users>
                </div>
            </div>

            <!-- Affichage des informations de réservation et sur l'utilisateur -->
            <div class="user">
                <div class="join">
                    <h2>Rejoindre la cuisine</h2>
                    <div class="price">
                        { recipe.price }€
                    </div>
                    <div>
                        Il reste { recipe.place_left } places
                    </div>
                    <form name="edit-reservation">
                        <div>
                            <input type="checkbox" name="cgu" ref="cgu"> J'accepte les CGU
                        </div>
                        <div>
                            <input type="checkbox" name="pc" ref="pc"> J'accepte la charte de bonne conduite
                        </div>
                        <input type="button" class="large" value="Je rejoins la cuisine" onclick='{ join }'>
                    </form>
                </div>

                <app-useritem ref="useritem" user="{ recipe.user }"></app-useritem>
            </div>
        </div>
    </div>

    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.recipe = null;

        tag.on("before-mount", () => {
            tag.recipe = tag.opts.recipe;
            if (tag.recipe == null)
                throw new Error("Recipe cant be null.");
        });

        tag.join = function () {
            if(tag.refs.cgu.checked == false)
            {
                vex.dialog.alert("Vous devez accepter les CGU pour etre en mesure de réserver avec Melting Cook.");
                return;
            }
            if(tag.refs.pc.checked == false)
            {
                vex.dialog.alert("Vous devez accepter la charte de bonne conduite pour etre en mesure de réserver avec Melting Cook.");
                return;
            }
            route("/reservation/recipe/"+tag.recipe.id);
        }
    </script>
</app-recipe>