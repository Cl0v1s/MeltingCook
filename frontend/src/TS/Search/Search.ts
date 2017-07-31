class Search {
    public static search(place, origin, date): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            var filters = {
            };
            if(place != null && place != "")
                filters["geolocation"] = place;
            if(origin != null && origin !="")
                filters["origin"] = origin;
            if(date != null && date != "")
            {
                    filters["date_start"] = date;
                    filters["date_end"] = date;
            }
            var retrieve = App.request(App.Address + "/getrecipes", {
                "filters": JSON.stringify(filters)
            });
            retrieve.then(function (response : any) {
                resolve(response.data);
            });
            retrieve.catch(function (error) {
                reject(error);
            });
        });

    }
}