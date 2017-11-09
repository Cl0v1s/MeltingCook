<app-searchresults>
    <app-header></app-header>
    <app-searcher expanded="{ true }" params="{ opts.params }"></app-searcher>
    <div class="content">
        <section>
            <h1>Résultats de la recherche</h1>
            <hr>
            <app-recipes recipes={ opts.recipes }></app-recipes>
        </section>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

    </script>
</app-searchresults>