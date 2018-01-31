<app-recipeeditform>
    <form name="edit-recipe" if="{ recipe != null }">
        <section>
            <h1>Proposer une recette</h1>
        </section>
        <section>
            <h2>Informations de base</h2>
            <div>
                <label>Nom de la recette *</label>
                <input type="text" value="{ recipe.name }" placeholder="Nom de la recette" ref="name" name="fullname">
                <p class="hint">
                    Ce champ est requis et ne peut contenir plus de 400 caractères.
                </p>
            </div>
            <div>
                <label>Description *</label>
                <textarea name="description" ref="description" placeholder="Décrivez votre recette en quelques mots">{recipe.description}</textarea>
                <p class="hint">
                    Ce champ est requis. Il ne peut contenir moins de 50 ou plus de 1000 caractères.
                </p>
            </div>
            <div>
                <label>Associer une image *</label>
                <input type="text" ref="picture" name="picture" placeholder="Précisez un lien URL vers l'image de votre choix" value="{ recipe.picture }">
                <p class="hint">
                    Ce champ est requis. Il doit contenir une url valide comportant moins de 400 caractères.
                </p>
            </div>
        </section>

        <section>
            <h2>Ingrédients et origine</h2>
            <div>
                <label>Type de cuisine *</label>
                <app-origininput ref="origin" name="origin" origin="{ recipe.origin }"></app-origininput>
                <p class="hint">
                    Ce champ est requis et ne peut contenir plus de 400 caractères.
                </p>
            </div>
            <div>
                <label>Les "plus"</label>
                <app-pinsinput ref="pins" name="pins" pins="{ recipe.pins }"></app-pinsinput>
                <p class="hint">
                    Ce champ ne peut contenir plus de 1000 caractères.
                </p>
            </div>
            <div>
                <label>Ingrédients principaux *</label>
                <app-manyinputs ref="items" name="items" value="{ recipe.items }"></app-manyinputs>
                <p class="hint">
                    Ce champ est requis et ne peut contenir plus de 1000 caractères.
                </p>
            </div>
        </section>

        <section>
            <h2>Organisation</h2>
            <div if="{ recipe == null || recipe.id == null }">
                <label>Prix de la participation *</label>
                <input type="number" ref="price" name="price" value="{ recipe.price }" placeholder="Prix de la participation">
                <p class="hint">
                    Ce champ est requis et doit contenir un nombre supérieur ou égal à 0.
                </p>
            </div>
            <div>
                <label>Nombre de places disponibles *</label>
                <input type="number" ref="places" name="places" value="{ recipe.places }" placeholder="Nombre de places disponibles">
                <p class="hint">
                    Ce champ est requis et doit contenir un nombre supérieur ou égal à 1.
                </p>
            </div>
            <div>
                <label>Nom de la ville/village *</label>
                <app-placeinput ref="place" name="place" place="{ recipe.place }"></app-placeinput>
                <p class="hint">
                    Ce champ est requis et ne peut contenir plus de 400 caractères.
                </p>
            </div>
            <div>
                <label>Date de début de l'offre *</label>
                <app-dateinput ref="date_start" name="date_start" date="{ recipe.date_start_readable }"></app-dateinput>
                <p class="hint">
                    Ce champ est requis.
                </p>
            </div>
            <div>
                <label>Date de fin de l'offre *</label>
                <app-dateinput ref="date_end" name="date_end" date="{ recipe.date_end_readable }"></app-dateinput>
                <p class="hint">
                    Ce champ est requis.
                </p>
            </div>
        </section>

        <p>
            Les champs marqués d'une * sont requis.
        </p>
        <input type="button" class="large" value="Publier ma recette" onclick="{ validate }">
    </form>
    <script>
        var tag = this;

        tag.recipe = null;

        tag.on("before-mount", function()
        {
            tag.recipe = tag.opts.recipe;
            if(tag.recipe === null)
                throw new Error("Recipe cant be null.");
        });

        tag.setRecipe = function(recipe)
        {
            tag.recipe = recipe;
            tag.update();
        };

        tag.validate = function()
        {
            var valid = new Validatinator({
                "edit-recipe": {
                    "fullname" : "required|maxLength:400",
                    "description" : "required|minLength:50|maxLength:1000",
                    "picture" : "required|maxLength:1000",
                    "price" : "required|number|min:0",
                    "places" : "required|number|min:1"
                }
            });
            if (valid.passes("edit-recipe")) {
                // Validation des valeurs custom
                var errors = {
                    "edit-recipe" : {}
                };
                // Confirmation de la picture
                if(tag.refs.picture.value != "")
                {
                    if(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(tag.refs.picture.value) == false)
                    {
                        errors["edit-recipe"].picture = {
                            "required" : "true"
                        };
                    }
                }

                if(tag.refs.origin.value === "" || tag.refs.origin.value.length > 400)
                {
                    errors["edit-recipe"].origin = {
                        "required" : "true"
                    };
                }
                if(tag.refs.items.value === "" || tag.refs.items.value.length > 1000)
                {
                    errors["edit-recipe"].items = {
                        "required" : "true"
                    };
                }
                if(tag.refs.date_start.value === null)
                {
                    errors["edit-recipe"].date_start = {
                        "required" : "true"
                    };
                }
                if(tag.refs.date_end.value === null)
                {
                    errors["edit-recipe"].date_end = {
                        "required" : "true"
                    };
                }
                if(tag.refs.pins.value.length > 1000)
                {
                    errors["edit-recipe"].pins = {
                        "required" : "true"
                    };
                }
                if(tag.refs.place.value == null)
                {
                    errors["edit-recipe"].place = {
                        "required" : "true"
                    }
                }
                if(Object.keys(errors["edit-recipe"]).length > 0)
                {
                    App.diagnosticForm("edit-recipe", errors);
                    return;
                }
                tag.send();
            }
            if(valid.fails("edit-recipe")) {
                App.diagnosticForm("edit-recipe", valid.errors);
            }
        };

        tag.send = function()
        {
            var address  = App.Address + "/updaterecipe";
            var rcp = tag.recipe;
            if(rcp == null || rcp.id == null)
            {
                rcp = {};
                address = App.Address + "/addrecipe";
            }
            rcp.name = tag.refs.name.value;

            rcp.description = tag.refs.description.value;
            rcp.picture = tag.refs.picture.value;
            rcp.origin = tag.refs.origin.value;
            rcp.items = tag.refs.items.value;
            rcp.date_start = tag.refs.date_start.value;
            rcp.date_end = tag.refs.date_end.value;
            rcp.price = tag.refs.price.value;
            rcp.places = tag.refs.places.value;
            rcp.pins = tag.refs.pins.value;
            rcp.place = tag.refs.place.value.name;
            rcp.latitude = tag.refs.place.value.latitude;
            rcp.longitude = tag.refs.place.value.longitude;

            var request = App.request(address, rcp);
            request.then((response) => {
                route("/recipe/"+response.data);
            });
            request.catch((error) => {
                ErrorHandler.alertIfError(error);
            });
        }
    </script>
</app-recipeeditform>