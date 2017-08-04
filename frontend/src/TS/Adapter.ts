class Adapter
{
    public static adaptRecipe(recipe : any) : any
    {
        var date_start = new Date(recipe.date_start*1000);
        recipe.date_start = date_start.getDate() + "/"+(date_start.getMonth()+1)+"/"+date_start.getFullYear();
        var date_end = new Date(recipe.date_end*1000);
        recipe.date_end = date_end.getDate() + "/"+(date_end.getMonth()+1)+"/"+date_end.getFullYear();

        if(recipe.pins != null)
            recipe.pins = recipe.pins.split(";");
        else 
            recipe.pins = [];
        recipe.origin = recipe.origin.split(";");
        recipe.items = recipe.items.split(";");

        recipe.place_left = parseInt(recipe.places) - recipe.users.length; 

        return recipe;
    }

    public static adaptUser(user : any) : any
    {
        if(user.discease != null)
            user.discease = user.discease.split(";");
        else user.discease = [];
        if(user.preference != null)
            user.preference = user.preference.split(";");
        else user.preference= [];
        if(user.pins != null)
            user.pins = user.pins.split(";");
        else user.pins = [];

        if(user.discease[user.discease.length -1 ] == "" || user.discease[user.discease.length -1 ] == null)
            user.discease.pop();
        if(user.preference[user.preference.length -1 ] == "" || user.preference[user.preference.length -1 ] == null)
            user.preference.pop();
        if(user.pins[user.pins.length -1 ] == "" || user.pins[user.pins.length -1 ] == null)
            user.pins.pop();

        return user;
    }
}