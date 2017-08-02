<app-recipe>
    <app-header></app-header>

    <div>

        <!-- Présentation des informations sur la recette-->
        <div class="infos">
            <div class="banner"></div>

            <div class="base">
                <div class="name">
                    <h1>{ recipe.name }</h1>
                    <div class="pins">
                        <div class="Pins" each={ p in recipe.pins }>{ p }</div>
                    </div>
                </div>
                <div class="description">
                    <p>
                        { recipe.description }
                    </p>
                </div>
            </div>

            <div class="geolocation">
                <app-placehint latitude={ recipe.latitude } longitude={ recipe.longitude}></app-placehint>
            </div>

            <div class="details">
                <h2>Ingédients:</h2>
                <ul>
                    <li each={ item in recipe.items }>{ item }</li>
                </ul>
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
                    <input type="button" class="large" value="Je rejoins la cuisine" onclick={ join }>
                </form>
            </div>

            <app-useritem user={ recipe.user }></app-useritem>
        </div>
    </div>

    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.recipe = tag.opts.recipe;

        tag.on("mount", () => {
            if (tag.recipe == null && tag.opts.pass != null)
                tag.retrieveRecipe(tag.opts.pass);
        });

        tag.retrieveRecipe = function (id) {
            var request = App.request(App.Address + "/getrecipe", {
                "id": id
            });
            request.then((response) => {
                tag.recipe = Adapter.adaptRecipe(response.data);
                tag.update();
            });
            request.catch((error) => {
                if (error == null) {
                    vex.dialog.alert("Oops.. Quelque chose s'est mal passé. Veuillez réessayer plus tard.");
                }
                route("/");
            });
        };

        tag.join = function()
        {

        }
    </script>
</app-recipe>