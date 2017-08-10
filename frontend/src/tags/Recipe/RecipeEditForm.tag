<app-recipeeditform>
    <form name="edit-recipe" if="{ recipe != null }">
        <div>
            <h2>Informations de base</h2>
            <div>
                <label>Nom de la recette</label>
                <input type="text" value="{ recipe.name }" placeholder="Nom de la recette" ref="name" name="fullname">
            </div>
            <div>
                <label>Description</label>
                <textarea name="description" ref="description" placeholder="Décrivez votre recette en quelques mots">{recipe.description}</textarea>
            </div>
            <div>
                <label>Associer une image</label>
                <input type="text" ref="picture" name="picture" placeholder="Précisez un lien URL vers l'image de votre choix" value="{ recipe.picture }">
            </div>
        </div>
        <div>
            <h2>Organisation</h2>
            <div>
                <label>Prix de la participation</label>
                <input type="number" ref="price" name="price" value="{ recipe.price }">
            </div>
            <div>
                <label>Nombre de places disponibles</label>
                <input type="number" ref="places" name="places" value="{ recipe.places }">
            </div>
            <div>
                <label>Nom de la ville/village</label>
                <app-placeinput ref="place" name="place" place="{ recipe.place }"></app-placeinput>
            </div>
            <div>
                <label>Date de début de l'offre</label>
                <app-dateinput ref="date_start" name="date_start" date="{ recipe.date_start_readable }"></app-dateinput>
            </div>
            <div>
                <label>Date de fin de l'offre</label>
                <app-dateinput ref="date_end" name="date_end" date="{ recipe.date_end_readable }"></app-dateinput>
            </div>
        </div>
        <div>
            <h2>Ingrédients et origine</h2>
            <div>
                <label>Type de cuisine</label>
                <app-origininput ref="origin" name="origin" origin="{ recipe.origin }"></app-origininput>
            </div>
            <div>
                <label>Les "plus"</label>
                <app-pinsinput ref="pins" name="pins" pins="{ recipe.pins }"></app-pinsinput>
            </div>
            <div>
                <label>Ingrédients principaux</label>
                <app-manyinputs ref="items" name="items" value="{ recipe.items }"></app-manyinputs>
            </div>
        </div>

        <input type="button" class="large" value="Publier ma recette" onclick="{ validate }">
    </form>
    <script>
        var tag = this;

        tag.recipe = null;

        tag.on("before-mount", function()
        {
            tag.recipe = tag.opts.recipe;
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
                    "description" : "required|maxLength:1000",
                    "picture" : "required|maxLength:400|url",
                    "price" : "required|number|min:0",
                    "places" : "required|number|min:1"
                }
            });
            if (valid.passes("edit-recipe")) {
                // Validation des valeurs custom
                var errors = {
                    "edit-recipe" : {}
                };
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
                if(tag.refs.pins.value === "" || tag.refs.pins.value.length > 1000)
                {
                    errors["edit-recipe"].pins = {
                        "required" : "true"
                    };
                }
                if(tag.refs.place.getPlaceName() === "" || tag.refs.place.getPlaceName().length > 400)
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
            rcp.place = tag.refs.place.getPlaceName();

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