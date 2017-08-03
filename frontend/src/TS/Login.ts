class Login
{
    private static Instance : Login = new Login();

    public static GetInstance() : Login
    {
        return Login.Instance;
    }

    private token : string= null;
    private user : Object = null;

    constructor()
    {
        this.token = Cookies.getItem("token");
        this.user = Cookies.getItem("user");
    }

    public Token() : string
    {
        return this.token;
    }

    public User() :  Object
    {
        return this.user;
    }

    public setToken(token : string) : void 
    {
        this.token = token;
        Cookies.setItem("token", token, null, "/");
    }

    public setUser(user : Object) : void 
    {
        this.user = user;
        Cookies.setItem("user", JSON.stringify(user), null, "/");
    }

    public isLogged() : boolean
    {
        if(this.token == null)
            return false;
        return true;
    }

    public auth(username, password) : Promise
    {
        return new Promise((resolve, reject) => {
            var tmptoken = md5(username+md5(password));
            var retrieve = App.request(App.Address+"/auth", {
                token : tmptoken
            });
            retrieve.then((response) => {
                this.setToken(tmptoken);
                this.setUser(response.data);
                resolve(response.data);
            });
            retrieve.catch((error)=>{
                reject(error);
            });
        });
    }
}