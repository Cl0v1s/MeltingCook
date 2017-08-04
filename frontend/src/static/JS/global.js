class Adapter {
    static adaptRecipe(recipe) {
        var date_start = new Date(recipe.date_start * 1000);
        recipe.date_start = date_start.getDate() + "/" + (date_start.getMonth() + 1) + "/" + date_start.getFullYear();
        var date_end = new Date(recipe.date_end * 1000);
        recipe.date_end = date_end.getDate() + "/" + (date_end.getMonth() + 1) + "/" + date_end.getFullYear();
        if (recipe.pins != null)
            recipe.pins = recipe.pins.split(";");
        else
            recipe.pins = [];
        if (recipe.origin != null)
            recipe.origin = recipe.origin.split(";");
        else
            recipe.origin = [];
        if (recipe.items != null)
            recipe.items = recipe.items.split(";");
        else
            recipe.items = [];
        if (recipe.origin[recipe.origin.length - 1] == "" || recipe.origin[recipe.origin.length - 1] == null)
            recipe.origin.pop();
        if (recipe.items[recipe.items.length - 1] == "" || recipe.items[recipe.items.length - 1] == null)
            recipe.items.pop();
        if (recipe.pins[recipe.pins.length - 1] == "" || recipe.pins[recipe.pins.length - 1] == null)
            recipe.pins.pop();
        recipe.place_left = parseInt(recipe.places) - recipe.users.length;
        return recipe;
    }
    static adaptUser(user) {
        if (user.discease != null)
            user.discease = user.discease.split(";");
        else
            user.discease = [];
        if (user.preference != null)
            user.preference = user.preference.split(";");
        else
            user.preference = [];
        if (user.pins != null)
            user.pins = user.pins.split(";");
        else
            user.pins = [];
        if (user.discease[user.discease.length - 1] == "" || user.discease[user.discease.length - 1] == null)
            user.discease.pop();
        if (user.preference[user.preference.length - 1] == "" || user.preference[user.preference.length - 1] == null)
            user.preference.pop();
        if (user.pins[user.pins.length - 1] == "" || user.pins[user.pins.length - 1] == null)
            user.pins.pop();
        return user;
    }
}
var App = {
    Address: "http://localhost:8080/API",
    Page: null,
    PopUp: null,
    request: function (address, data) {
        return new Promise(function (resolve, reject) {
            var href = window.location.href;
            if (data == null)
                data = {};
            if (address.indexOf(App.Address) != -1 && Login.GetInstance().isLogged())
                data.token = Login.GetInstance().Token();
            var request = ajax({
                method: "POST",
                url: address,
                "data": data
            });
            App.showLoading();
            request.then(function (response) {
                App.hideLoading();
                if (App.checkPage(href) == false) {
                    reject(null);
                    return;
                }
                if (address.indexOf(App.Address) != -1 && App.analyseResponse(response) == false) {
                    reject(response.data);
                    return;
                }
                resolve(response);
            }, function (error) {
                App.hideLoading();
                if (App.checkPage(href) == false) {
                    reject(null);
                    return;
                }
                vex.dialog.alert("Une erreur réseau a eu lieu. Vérifiez votre connexion et réessayez.");
                reject(error);
            });
        });
    },
    analyseResponse: function (data) {
        if (data.state != "OK") {
            if (data.data == 0) {
                vex.dialog.alert("Vos informations de connexion ne sont pas valides.");
                return false;
            }
            else if (data.data == 1) {
                vex.dialog.alert("Vous n'avez pas les droits suffisants.");
                return false;
            }
            else if (data.data == "23000" || data.data == 23000) {
                vex.dialog.alert("Impossible de supprimer cet item. D'autres éléments dépendent de lui.");
                return false;
            }
            else if (data.data == "105" || data.data == 105) {
                vex.dialog.alert("Une valeur requise est manquante. Veuillez vérifier le formulaire.");
                return false;
            }
            vex.dialog.alert("Erreur " + data.data + ":\n\nQuelque chose s'est mal passé. Si cela persiste contactez le développeur.");
            return false;
        }
        return true;
    },
    checkPage: function (page) {
        if (window.location.href != page)
            return false;
        return true;
    },
    changePage: function (tag, data) {
        if (App.Page != null) {
            App.Page.forEach(function (t) {
                t.unmount();
            });
            var e = document.createElement("div");
            e.id = "app";
            document.body.appendChild(e);
        }
        App.hideLoading();
        App.Page = riot.mount("div#app", tag, { pass: data });
    },
    showPopUp: function (tag, title, data) {
        if (App.PopUp != null) {
            App.PopUp.forEach(function (t) {
                t.unmount();
            });
            if (document.querySelector("div#popup") != null)
                document.querySelector("div#popup").remove();
        }
        var e = document.createElement("div");
        e.id = "popup";
        e.setAttribute("data-name", title);
        var d = document.createElement("div");
        e.appendChild(d);
        var close = document.createElement("div");
        close.className = "close";
        close.innerHTML = "🞩";
        e.appendChild(close);
        close.addEventListener("click", App.hidePopUp);
        document.body.appendChild(e);
        App.PopUp = riot.mount(d, tag, data);
        return App.PopUp;
    },
    hidePopUp: function () {
        if (App.PopUp != null) {
            App.PopUp.forEach(function (t) {
                t.unmount();
            });
            if (document.querySelector("div#popup") != null)
                document.querySelector("div#popup").remove();
        }
    },
    showLoading: function () {
        if (document.getElementById("loading") != null)
            return;
        var e = document.createElement("div");
        e.id = "loading";
        document.body.appendChild(e);
    },
    hideLoading: function () {
        var e = document.getElementById("loading");
        if (e == null)
            return;
        e.remove();
    },
};
!function (n) {
    "use strict";
    function t(n, t) { var r = (65535 & n) + (65535 & t), e = (n >> 16) + (t >> 16) + (r >> 16); return e << 16 | 65535 & r; }
    function r(n, t) { return n << t | n >>> 32 - t; }
    function e(n, e, o, u, c, f) { return t(r(t(t(e, n), t(u, f)), c), o); }
    function o(n, t, r, o, u, c, f) { return e(t & r | ~t & o, n, t, u, c, f); }
    function u(n, t, r, o, u, c, f) { return e(t & o | r & ~o, n, t, u, c, f); }
    function c(n, t, r, o, u, c, f) { return e(t ^ r ^ o, n, t, u, c, f); }
    function f(n, t, r, o, u, c, f) { return e(r ^ (t | ~o), n, t, u, c, f); }
    function i(n, r) { n[r >> 5] |= 128 << r % 32, n[(r + 64 >>> 9 << 4) + 14] = r; var e, i, a, h, d, l = 1732584193, g = -271733879, v = -1732584194, m = 271733878; for (e = 0; e < n.length; e += 16)
        i = l, a = g, h = v, d = m, l = o(l, g, v, m, n[e], 7, -680876936), m = o(m, l, g, v, n[e + 1], 12, -389564586), v = o(v, m, l, g, n[e + 2], 17, 606105819), g = o(g, v, m, l, n[e + 3], 22, -1044525330), l = o(l, g, v, m, n[e + 4], 7, -176418897), m = o(m, l, g, v, n[e + 5], 12, 1200080426), v = o(v, m, l, g, n[e + 6], 17, -1473231341), g = o(g, v, m, l, n[e + 7], 22, -45705983), l = o(l, g, v, m, n[e + 8], 7, 1770035416), m = o(m, l, g, v, n[e + 9], 12, -1958414417), v = o(v, m, l, g, n[e + 10], 17, -42063), g = o(g, v, m, l, n[e + 11], 22, -1990404162), l = o(l, g, v, m, n[e + 12], 7, 1804603682), m = o(m, l, g, v, n[e + 13], 12, -40341101), v = o(v, m, l, g, n[e + 14], 17, -1502002290), g = o(g, v, m, l, n[e + 15], 22, 1236535329), l = u(l, g, v, m, n[e + 1], 5, -165796510), m = u(m, l, g, v, n[e + 6], 9, -1069501632), v = u(v, m, l, g, n[e + 11], 14, 643717713), g = u(g, v, m, l, n[e], 20, -373897302), l = u(l, g, v, m, n[e + 5], 5, -701558691), m = u(m, l, g, v, n[e + 10], 9, 38016083), v = u(v, m, l, g, n[e + 15], 14, -660478335), g = u(g, v, m, l, n[e + 4], 20, -405537848), l = u(l, g, v, m, n[e + 9], 5, 568446438), m = u(m, l, g, v, n[e + 14], 9, -1019803690), v = u(v, m, l, g, n[e + 3], 14, -187363961), g = u(g, v, m, l, n[e + 8], 20, 1163531501), l = u(l, g, v, m, n[e + 13], 5, -1444681467), m = u(m, l, g, v, n[e + 2], 9, -51403784), v = u(v, m, l, g, n[e + 7], 14, 1735328473), g = u(g, v, m, l, n[e + 12], 20, -1926607734), l = c(l, g, v, m, n[e + 5], 4, -378558), m = c(m, l, g, v, n[e + 8], 11, -2022574463), v = c(v, m, l, g, n[e + 11], 16, 1839030562), g = c(g, v, m, l, n[e + 14], 23, -35309556), l = c(l, g, v, m, n[e + 1], 4, -1530992060), m = c(m, l, g, v, n[e + 4], 11, 1272893353), v = c(v, m, l, g, n[e + 7], 16, -155497632), g = c(g, v, m, l, n[e + 10], 23, -1094730640), l = c(l, g, v, m, n[e + 13], 4, 681279174), m = c(m, l, g, v, n[e], 11, -358537222), v = c(v, m, l, g, n[e + 3], 16, -722521979), g = c(g, v, m, l, n[e + 6], 23, 76029189), l = c(l, g, v, m, n[e + 9], 4, -640364487), m = c(m, l, g, v, n[e + 12], 11, -421815835), v = c(v, m, l, g, n[e + 15], 16, 530742520), g = c(g, v, m, l, n[e + 2], 23, -995338651), l = f(l, g, v, m, n[e], 6, -198630844), m = f(m, l, g, v, n[e + 7], 10, 1126891415), v = f(v, m, l, g, n[e + 14], 15, -1416354905), g = f(g, v, m, l, n[e + 5], 21, -57434055), l = f(l, g, v, m, n[e + 12], 6, 1700485571), m = f(m, l, g, v, n[e + 3], 10, -1894986606), v = f(v, m, l, g, n[e + 10], 15, -1051523), g = f(g, v, m, l, n[e + 1], 21, -2054922799), l = f(l, g, v, m, n[e + 8], 6, 1873313359), m = f(m, l, g, v, n[e + 15], 10, -30611744), v = f(v, m, l, g, n[e + 6], 15, -1560198380), g = f(g, v, m, l, n[e + 13], 21, 1309151649), l = f(l, g, v, m, n[e + 4], 6, -145523070), m = f(m, l, g, v, n[e + 11], 10, -1120210379), v = f(v, m, l, g, n[e + 2], 15, 718787259), g = f(g, v, m, l, n[e + 9], 21, -343485551), l = t(l, i), g = t(g, a), v = t(v, h), m = t(m, d); return [l, g, v, m]; }
    function a(n) { var t, r = "", e = 32 * n.length; for (t = 0; t < e; t += 8)
        r += String.fromCharCode(n[t >> 5] >>> t % 32 & 255); return r; }
    function h(n) { var t, r = []; for (r[(n.length >> 2) - 1] = void 0, t = 0; t < r.length; t += 1)
        r[t] = 0; var e = 8 * n.length; for (t = 0; t < e; t += 8)
        r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32; return r; }
    function d(n) { return a(i(h(n), 8 * n.length)); }
    function l(n, t) { var r, e, o = h(n), u = [], c = []; for (u[15] = c[15] = void 0, o.length > 16 && (o = i(o, 8 * n.length)), r = 0; r < 16; r += 1)
        u[r] = 909522486 ^ o[r], c[r] = 1549556828 ^ o[r]; return e = i(u.concat(h(t)), 512 + 8 * t.length), a(i(c.concat(e), 640)); }
    function g(n) { var t, r, e = "0123456789abcdef", o = ""; for (r = 0; r < n.length; r += 1)
        t = n.charCodeAt(r), o += e.charAt(t >>> 4 & 15) + e.charAt(15 & t); return o; }
    function v(n) { return unescape(encodeURIComponent(n)); }
    function m(n) { return d(v(n)); }
    function p(n) { return g(m(n)); }
    function s(n, t) { return l(v(n), v(t)); }
    function C(n, t) { return g(s(n, t)); }
    function A(n, t, r) { return t ? r ? s(t, n) : C(t, n) : r ? m(n) : p(n); }
    "function" == typeof define && define.amd ? define(function () { return A; }) : "object" == typeof module && module.exports ? module.exports = A : n.md5 = A;
}(window);
class Login {
    constructor() {
        this.token = null;
        this.user = null;
        this.token = Cookies.getItem("token");
        this.user = Cookies.getItem("user");
    }
    static GetInstance() {
        return Login.Instance;
    }
    Token() {
        return this.token;
    }
    User() {
        return this.user;
    }
    setToken(token) {
        this.token = token;
        Cookies.setItem("token", token, null, "/");
    }
    setUser(user) {
        this.user = user;
        Cookies.setItem("user", JSON.stringify(user), null, "/");
    }
    isLogged() {
        if (this.token == null)
            return false;
        return true;
    }
    auth(username, password) {
        return new Promise((resolve, reject) => {
            var tmptoken = md5(username + md5(password));
            var retrieve = App.request(App.Address + "/auth", {
                token: tmptoken
            });
            retrieve.then((response) => {
                this.setToken(tmptoken);
                this.setUser(response.data);
                resolve(response.data);
            });
            retrieve.catch((error) => {
                reject(error);
            });
        });
    }
}
Login.Instance = new Login();
class Search {
    static search(place, origin, date, price_start, price_end) {
        return new Promise((resolve, reject) => {
            var filters = {};
            if (place != null && place != "")
                filters["geolocation"] = place;
            if (origin != null && origin != "")
                filters["origin"] = origin;
            if (date != null && date != "") {
                filters["date_start"] = date;
                filters["date_end"] = date;
            }
            if (price_start != null)
                filters["price_start"] = price_start;
            if (price_end != null)
                filters["price_end"] = price_end;
            var retrieve = App.request(App.Address + "/getrecipes", {
                "filters": JSON.stringify(filters)
            });
            retrieve.then(function (response) {
                resolve(response.data);
            });
            retrieve.catch(function (error) {
                reject(error);
            });
        });
    }
}
//# sourceMappingURL=global.js.map