<app-commenteditform>
    <form name="edit-comment" class={ invisible : tag.comment==null }>
        <div>
            <label>Note</label>
            <app-hearts interactive="{ true }" ref="note"></app-hearts>
        </div>
        <div>
            <label>Contenu de l'avis</label>
            <textarea name="content" ref="content">
                { comment.content }
            </textarea>
            <p class="hint">
                Ce champ doit contenir entre 10 et 400 caractères.
            </p>
        </div>
        <input type="button" class="large" value="Envoyer" onclick='{ send }'>
    </form>

    <script>
        var tag = this;

        tag.comment = tag.opts.comment;
        tag.target = tag.opts.target;
        tag.author = tag.opts.author;
        tag.callback = tag.opts.callback;

        tag.send = function () {
                var valid = new Validatinator({
                    "edit-comment": {
                        "content": "required|minLength:10|maxLength:400"
                    }
                });
                if (valid.passes("edit-comment")) {
                    var url = App.Address + "/updatecomment";
                    var cmt = tag.comment;
                    if(cmt == null || cmt.id == null)
                    {
                        url = App.Address + "/addcomment";
                        cmt = {};
                        cmt.author_id = tag.author.id;
                        cmt.target_id = tag.target.id;
                    }
                    cmt.content = tag.refs.content.value;
                    cmt.note = tag.refs.note.value;
                    var request = App.request(url, cmt);
                    request.then((response) => {
                        tag.callback();
                    });
                    request.catch((error) => {
                        ErrorHandler.alertIfError(error);
                    });
                }
                if(valid.fails("edit-comment"))
                {
                    App.diagnosticForm("edit-comment", valid.errors);
                }

        }
    </script>
</app-commenteditform>