<app-dateinput>

    <input type="text" ref="date" name="date" id="date" placeholder="Date">

    <script>
        var tag = this;
        tag.value = null;

        tag.on("mount", () => {
            var picker = $('input', tag.root).pickadate({
                format: 'dd/mm/yyyy',
                formatSubmit: 'dd/mm/yyyy',
                hiddenName: true
            });

            $('input', tag.root)
                .pickadate('picker')
                .on('render', function () {
                    var date = $('input', tag.root).pickadate('picker').get("value");
                    if(date === null)
                        return;
                    date = date.split("/");
                    date = new Date(date[2], parseInt(date[1]) - 1, date[0]);
                    tag.value = Math.round(date.getTime() / 1000);
                    if(isNaN(tag.value))
                        tag.value = null;

                });

            if(tag.opts.date != null)
            {
                tag.setValueFromStamp(tag.opts.date);
                picker.pickadate('picker').set("select", parseInt(tag.opts.date)*1000);
            }
        });

        tag.setValueFromStamp = function(date)
        {
            tag.value = date;
            if(isNaN(tag.value))
                tag.value = null;
            var readable = new Date();
            readable.setTime(parseInt(date) * 1000);
            tag.refs.date.value = readable.getDate()+"/"+(readable.getMonth()+1)+"/"+readable.getFullYear();
        }
    </script>
</app-dateinput>