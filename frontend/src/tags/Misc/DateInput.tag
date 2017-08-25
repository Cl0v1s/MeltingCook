<app-dateinput>

    <input type="text" ref="date" name="date" id="date" placeholder="Date" value="{ opts.date }">

    <script>
        var tag = this;
        tag.value = null;


        tag.on("before-mount", function()
        {
            if(tag.opts.date != null)
            {
                tag.setValue(tag.opts.date);
            }
        });

        tag.on("mount", () => {
            var picker = $('input', tag.root).pickadate({
                format: 'dd/mm/yyyy',
                formatSubmit: 'dd/mm/yyyy',
                hiddenName: true
            });

            if(tag.opts.date !== null)
            {
                picker.pickadate('picker').set("select", tag.opts.date);
            }


            $('input', tag.root)
                .pickadate('picker')
                .on('render', function () {
                    var date = $('input', tag.root).pickadate('picker').get("value");
                    if(date === null)
                        return;
                    tag.setValue(date);
                });
        });

        tag.setValue = function(date)
        {
            date = date.split("/");
            date = new Date(date[2], parseInt(date[1]) - 1, date[0]);
            tag.value = Math.round(date.getTime() / 1000);
        }
    </script>
</app-dateinput>