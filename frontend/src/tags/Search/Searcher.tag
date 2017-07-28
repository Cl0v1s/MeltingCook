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
        <input type="text" ref="place" name="place" placeholder="Lieu de partage">
        <input type="text" ref="origin" name="origin" placeholder="Type de cuisine">
        <!--TODO: ajouter un sélécteur de date-->
        <input type="text" ref="date" name="date" placeholder="Date">
        <input type="button" value="Chercher un moment sympa !" onclick={ send }>
    </form>


    <script>
        var tag = this;

        tag.on("mount", function()
        {

        });

        tag.send = function()
        {

        };
    </script>
</app-searcher>