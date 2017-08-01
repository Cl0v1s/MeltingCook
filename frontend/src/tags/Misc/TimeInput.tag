<app-timeinput>

    <input type="text" ref="date" name="date" id="date" placeholder="Date">

    <script>
        var tag = this;
        tag.value = null;

        tag.on("mount", () => {
            var picker = $("#date").pickadate({
                format: 'dd/mm/yyyy',
                formatSubmit: 'dd/mm/yyyy',
                hiddenName: true
            });

            $('#date')
                .pickadate('picker')
                .on('render', function () {
                    var date = $('#date').pickadate('picker').get("value");
                    if(date == null)
                        return;
                    date = date.split("/");
                    date = new Date(date[2], parseInt(date[1]) - 1, date[0]);
                    tag.value = Math.round(date.getTime() / 1000);
                });
        });
    </script>
</app-timeinput>