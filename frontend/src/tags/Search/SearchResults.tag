<app-searchresults>
    <app-header></app-header>
    <div class="content">
        <app-searcher expanded="{ true }" params="{ opts.params }"></app-searcher>

        <section>
            <h1>Résultats de la recherche</h1>
            <app-recipes recipes={ opts.recipes }></app-recipes>
        </section>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

    </script>
</app-searchresults>