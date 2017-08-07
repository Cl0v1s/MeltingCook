<app-searcher>
    <div>
        <img>
        <div>
            <h3>A vos cuisines... Partez !</h3>
            <p>
                La découverte dans vos assiettes.
            </p>
        </div>
    </div>
    <form>
        <app-placeinput ref="place"></app-placeinput>
        <app-origininput ref="origin"></app-origininput>
        <app-dateinput ref="date"></app-dateinput>        
        <input type="button" value="Chercher un moment sympa !" onclick={ send }>
    </form>


    <script>
        var tag = this;

        tag.send = function()
        {
            var retrieve = Search.search(tag.refs.place.value, tag.refs.origin.value, tag.refs.date.value);
            retrieve.then(function(data)
            {
                App.changePage("app-searchresults", data);
            });
            retrieve.catch(function(error)
            {
                        ErrorHandler.alertIfError(error);

            });
        };
    </script>
</app-searcher>