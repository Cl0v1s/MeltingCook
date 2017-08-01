<app-user>
    <app-header></app-header>
    <div>
        <div class="banner" style="background-image: url('{ user.banner }');">
            <img src={ user.picture }>
            <div class="identity">
                <span>{ user.username }</span>
                <span>{ user.age } ans</span>
            </div>
            <div class="check">
                <span>Cuisinnier vérifié</span>
            </div>
        </div>
        <div class="description">
            <h2>Présentation du chef</h2>
            <p>
                { user.description }
            </p>
        </div>
        <div class="more">
            <div class="discease">
                <h2>Ses allergies</h2>
                <ul>
                    <li each={ d in user.discease }>{ d }</li>
                </ul>
            </div>
            <div class="preference">
                <h2>Ses inspirations</h2>
                <ul>
                    <li each={ p in user.preference }>{ p }</li>
                </ul>
            </div>
            <div class="pins">
                <h2>Ses "plus"</h2>
                <ul>
                    <li each={ p in user.pins }>{ p }</li>
                </ul>
            </div>
        </div>
        <div class="comments">
            <h2>Ses avis</h2><div class="Hearts nb-{ user.likes }"></div>
            <app-comments comments={ user.comments }></app-comments>
        </div>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.user = tag.opts.user;

        tag.on("mount", function()
        {
            if(tag.user == null && tag.opts.pass != null)
                tag.retrieveUser(tag.opts.pass);
        });

        tag.retrieveUser = function(id)
        {
            var request = App.request(App.Address + "/getuser", {
                "id" : id
            });
            request.then((response) => {
                tag.prepareUser(response.data);
            });
            request.catch((error) => {
                if(error == null)
                {
                    vex.dialog.alert("Ooops.. Une erreur est survenue. Veuillez réessayer plus tard.");
                }
                route("/");
            });
        }

        tag.prepareUser = function(user)
        {
            user.discease = user.discease.split(";");
            user.preference = user.preference.split(";");
            user.pins = user.pins.split(";");

            tag.user = user;
            tag.update();
        }
    </script>
</app-user>