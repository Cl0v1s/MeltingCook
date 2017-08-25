var Cookies = <Cookies>require("js-cookie");
var md5 = <MD5>require("md5");
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
        this.token = Cookies.get("token");
        if(Cookies.get("user") != null)
            this.user = JSON.parse(Cookies.get("user"));
    }

    public Token() : string
    {
        return this.token;
    }

    public User() :  any
    {
        return this.user;
    }

    public setToken(token : string) : void 
    {
        this.token = token;
        Cookies.set("token", token);
    }

    public setUser(user : Object) : void 
    {
        this.user = user;
        Cookies.set("user", JSON.stringify(user));
    }

    public logout() : void 
    {
        this.setToken(null);
        this.setUser(null);
    }

    public isLogged() : boolean
    {
        if(this.token == null)
            return false;
        return true;
    }

    public auth(username, password) : Promise<any>
    {
        return new Promise((resolve, reject) => {
            var tmptoken = md5(username+md5(password));
            var retrieve = App.request(App.Address+"/auth", {
                token : tmptoken
            }, false);
            retrieve.then((response : any) => {
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