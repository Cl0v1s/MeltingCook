class Search {
    public static search(place, origin, date): Promise {
        return new Promise((resolve, reject) => {
            var filters = {
                "origin": origin,
                "date_start": date,
                "date_end": date,
                "geolocation": place
            };
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