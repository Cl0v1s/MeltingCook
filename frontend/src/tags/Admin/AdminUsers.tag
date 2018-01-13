<app-adminusers>
    <app-header></app-header>
    <app-tabbar tabs="{ tabs }"></app-tabbar>
    <div class="content no-margin">
        <div class="search">
            <form name="search-user">
                <h2>Chercher</h2>
                <app-userselector ref="user"></app-userselector>                
                <input type="button" value="Rechercher" onclick='{ search }'>
            </form>
        </div>
        <table>
            <thead>
                <tr>
                    <td>Intitulé</td><td>Actions</td>
                </tr>
            </thead>
            <tbody>
                <tr each="{ user, i in users }" id="item-{ user.id }">
                    <td>{ user.username }</td>
                    <td>
                        <a class="onclick" onclick="{ see }" data-id="{ user.id }" data-index="{ i }">Voir le profil</a>
                        <a class="onclick" onclick="{ ban }" data-id="{ user.id }" data-index = "{ i }">
                            <virtual if="{user.banned != 1}">
                                Bannir
                            </virtual>
                            <virtual if="{user.banned != 0}">
                                Autoriser
                            </virtual>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.tabs = null;
        tag.users = null;

        tag.on("before-mount", function()
        {
            tag.users = tag.opts.users;
            if(tag.users == null)
                throw new Error("Users cant be null.");

            tag.tabs = [
            {
                name : "Utilisateurs",
                route : "/admin/users",
                selected : true
            },
                {
                    name : "Signalement",
                    route : "/admin/reports",
                    selected : false
                },
                {
                    name : "Transactions",
                    route : "/admin/reservations",
                    selected : false
                },
                {
                    name : "Origines",
                    route :"/admin/origins",
                    selected : false
                }
                ,
                {
                    name : "Les Plus",
                    route :"/admin/pins",
                    selected : false
                }
            ];
        });

        tag.search = function()
        {
            route("/admin/users/"+tag.refs.user.value);
        };


        tag.see = function(evt)
        {
            let id = evt.target.getAttribute("data-id");
            route("/user/"+id);
        };

        tag.ban = function(evt)
        {
            let index = evt.target.getAttribute("data-index");
            let user = {
                "id" : tag.users[index].id,
                "username" : tag.users[index].username,
                "banned" : tag.users[index].banned
            };
            if(user.banned == 0)
                user.banned = 1;
            else 
                user.banned = 0;
            let request = App.request(App.Address + "/updateuser", user);
            request.then(function(response){
                NotificationManager.showNotification("L'état de l'utilisateur "+user.username+" a été modifié.", "success");
            });
            request.catch(function(error){
                if(error instanceof Error)
                    ErrorHandler.alertIfError(error);
            });
        };


    </script>
</app-adminusers>