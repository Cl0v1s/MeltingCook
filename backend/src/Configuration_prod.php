<?php
    class Configuration
    {
        public static $DB_host = "meltingcxzclovis.mysql.db";
        public static $DB_login = "meltingcxzclovis";
        public static $DB_password = "Cheminade201";
        public static $DB_database = "meltingcxzclovis";

        public static $Errorlogger_echo = false;

        public static $Paypal_usesandbox = false;
        public static $Paypal_logincallback = "https://meltingcook.fr/";
        public static $Paypal_tokenservice = 'https://api.paypal.com/v1/identity/openidconnect/tokenservice';
        public static $Paypal_clientid = 'Authorization:  Basic QWYwTUtDZmlwZngxLVNMSE5zWGQ5VlZHQ3BTQU4yWlZBSGhoc0hqZ1ZzZUg2UmwxcFBkeGNzMmVFYjFHMG5yN2RpTTZsMDRveng4ZGdMdGQ6RURYb1FhLUlSMktFX3V0OWtRT3ZwMnlVZV9QUkV3TE9SeTlvVER4NjgyTGd1MTQ4MTVqNW03b0F0OEs1WkdfdElNMzhSazFNR3E4NW1fZEI=';
        public static $Paypal_userinfo = "https://api.paypal.com/v1/oauth2/token/userinfo?schema=openid";        
    }