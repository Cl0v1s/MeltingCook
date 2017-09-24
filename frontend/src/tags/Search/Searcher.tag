<app-searcher>
    <div>
        <div class="img"></div>
        <div>
            <h1>A vos cuisines... Partez !</h1>
            <h2>
                La découverte dans vos assiettes.
            </h2>
        </div>
    </div>
    <form>
        <app-placeinput ref="place" ></app-placeinput>
        <app-origininput ref="origin" origin="{ origin }"></app-origininput>
        <app-dateinput ref="date" date="{ date }"></app-dateinput>
        <div if="{ expanded }">
            <input type="number" ref="price_start" name="price_start" placeholder="Prix entre" value="{ price_start }"> - <input value="{ price_end }" type="number" name="price_end" ref="price_end" placeholder="Et">
        </div>
        <input type="button" value="Chercher un moment sympa !" onclick='{ send }'>
    </form>


    <script>
        var tag = this;

        tag.expanded = false;
        tag.place = null;
        tag.origin = null;
        tag.date = null;
        tag.price_start = null;
        tag.price_end = null;

        tag.on("before-mount", function()
        {
            if(tag.opts.expanded != null)
                tag.expanded = tag.opts.expanded;
            if(tag.opts.params != null)
            {
                if(tag.opts.params.length >= 1)
                    tag.place = tag.opts.params[0];
                if(tag.opts.params.length >= 2)
                    tag.origin = tag.opts.params[1];
                if(tag.opts.params.length >= 3 && tag.opts.params[2].trim().length > 0)
                    tag.date = tag.opts.params[2];
                if(tag.opts.params.length >= 4)
                    tag.price_start = tag.opts.params[3];
                if(tag.opts.params.length >= 5)
                    tag.price_end = tag.opts.params[4];
            }
        });

        tag.send = function()
        {
            var retrieve = null;
            var params = [tag.refs.place.value, tag.refs.origin.value, tag.refs.date.value];


            if(tag.expanded) {
                var price_start = null;
                var price_end = null;
                if (tag.refs.price_start.value != "") {
                    price_start = parseInt(tag.refs.price_start.value);
                    if (price_start < 0) {
                        vex.dialog.alert("Un prix ne peut etre inférieur à 0.");
                        return;
                    }
                }
                if (tag.refs.price_end.value != "") {
                    price_end = parseInt(tag.refs.price_end.value);
                    if (price_end < 0) {
                        vex.dialog.alert("Un prix ne peut etre inférieur à 0.");
                        return;
                    }
                }
                if (price_start != null && price_end != null) {
                    if (price_start > price_end) {
                        vex.dialog.alert("L'intervalle de prix est incohérent.");
                        return;
                    }
                }
                params.push(price_start);
                params.push(price_end);

                retrieve = Search.search(tag.refs.place.value, tag.refs.origin.value, tag.refs.date.value, price_start, price_end);
            }
            else
                retrieve = Search.search(tag.refs.place.value, tag.refs.origin.value, tag.refs.date.value);

            retrieve.then(function(data) {
                var res = "null";
                if(data.length > 0)
                    res = data.join(",");
                route("/search/results/"+res+"/params/"+params.join(","));
            });
            retrieve.catch(function(error)
            {
                ErrorHandler.alertIfError(error);
            });
        };
    </script>
</app-searcher>