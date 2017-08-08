<app-accountkitchen>
    <app-header></app-header>
    <app-tabbar tabs={ tabs }></app-tabbar>
    <div>
        <div class="header">
            <div class="img" style="background-image: url('{user.picture}');"></div>    
            <div class="identity">
                <span>Bonjour {user.username}</span>    
                <ul>
                    <li><a onclick={ edit }>Modifier votre profil</a></li>
                    <li><a onclick={ see }>Voir votre profil public</a></li>
                </ul>
            </div>
        </div>
        <div class="comments">
            <h2>Commentaires Récents</h2>
            <app-comments ref="comments" if={ comments != null } comments={ comments }></app-comments>
        </div>

    </div>
    <app-footer></app-footer>


    <script>
        var tag = this;
        tag.tabs = null;
        tag.user = null;
        tag.comments = null;

        tag.on("before-mount", function()
        {
            tag.user = Login.GetInstance().User();

            tag.tabs = [
                {
                    name: "Cuisine",
                    route: "/account",
                    selected : true
                },
                { 
                    name : "Recettes",
                    route : "/account/recipes",
                    selected : false
                },
                {
                    name : "Réservations",
                    route : "/account/reservations",
                    selected : false
                },
                {
                    name : "Profil",
                    route : "/account/user",
                    selected : false
                }
            ];

            tag.retrieveComments();
        });

        tag.retrieveComments = function()
        {
            if(tag.user == null || tag.user.id == null)
                return;
            var filters = {
                target_id : tag.user.id
            };
            var request = App.request(App.Address + "/getcomments", {
                filters : JSON.stringify(filters)
            });
            request.then((response) => {
                tag.comments = response.data.splice(0,5);
                tag.refs.comments.setComments(tag.comments);
            });
            request.catch((error) => {
                ErrorHandler.alertIfError(error);
            });
        }

        tag.edit = function()
        {
            route("/account/user");
        }

        tag.see = function()
        {
            route("/user/"+tag.user.id);
        }
    </script>
</app-accountkitchen>