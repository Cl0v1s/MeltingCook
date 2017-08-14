<app-searchitem>
    <div>
        <div class="img"></div>
        <div>
            <h2>A vos assiettes !</h2>
            <span>Cuisinez en bonne compagnie</span>
        </div>
    </div>
    <form name="edit-search">
        <app-placeinput ref="place"></app-placeinput>
        <app-dateinput ref="date"></app-dateinput>
        <app-origininput ref="origin"></app-origininput>
        <input type="number" ref="price_start" name="price_start" placeholder="Entre"> - <input type="number" name="price_end" ref="price_end" placeholder="Et">
        <input type="button" value="A vos ustensiles !" onclick='{ send }'>
    </form>

    <script>
        var tag = this;

        tag.send = function()
        {
            var valid = new Validatinator({
                "edit-search": {
                    "price_start" : "number",
                    "price_end" : "number"
                }
            });
            if(valid.passes("edit-search"))
            {
                var price_start = null;
                var price_end = null;
                if(tag.refs.price_start.value != "") {
                    price_start = parseInt(tag.refs.price_start.value);
                    if(price_start < 0) {
                        vex.dialog.alert("Un prix ne peut etre inférieur à 0.");
                        return;
                    }
                }
                if(tag.refs.price_end.value != "") {
                    price_end = parseInt(tag.refs.price_end.value);
                    if(price_end < 0) {
                        vex.dialog.alert("Un prix ne peut etre inférieur à 0.");
                        return;
                    }
                }
                if(price_start != null && price_end != null)
                {
                    if(price_start > price_end)
                    {
                        vex.dialog.alert("L'intervalle de prix est incohérent.");
                        return;
                    }
                }
                var date = null;
                if(tag.refs.date.value != null)
                    date = tag.refs.date.value;
                var retrieve = Search.search(tag.refs.place.value, tag.refs.origin.value, date, price_start, price_end);
                retrieve.then(function(data)
                {
                    App.changePage("app-searchresults", data);
                });
                retrieve.catch(function(error)
                {
                        ErrorHandler.alertIfError(error);

                });
            }
            else
                vex.dialog.alert("L'interval de prix doit être borné par des nombres.");

        }
    </script>
</app-searchitem>