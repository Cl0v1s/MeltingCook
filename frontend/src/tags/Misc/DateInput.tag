<app-dateinput>

    <input type="text" ref="time" name="time" id="time" placeholder="Heure">

    <script>
        var tag = this;
        tag.value = null;

        tag.on("mount", () => {
            var picker = $("#time").pickatime({
                format: 'HH:i',
                formatSubmit: 'HH:i',
                hiddenName: true
            });

            // Réglage de la date par défaut
            if(tag.opts.date != null)
            {
                picker.set("select", tag.opts.date);
            }

            $('#time')
                .pickatime('picker')
                .on('render', function () {
                    var time = $('#time').pickadate('picker').get("value");
                    if(time == null)
                        return;
                    time = time.split(":");
                    time = new Time(0,0,0,time[0], time[1]);
                    tag.value = Math.round(time.getTime() / 1000);
                });
        });
    </script>
</app-dateinput>