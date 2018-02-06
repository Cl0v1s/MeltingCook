<?php
    class Configuration
    {
        public static $DB_host = "meltingcxzclovis.mysql.db";
        public static $DB_login = "meltingcxzclovis";
        public static $DB_password = "Cheminade201";
        public static $DB_database = "meltingcxzclovis";

        public static $Errorlogger_echo = true;

        public static $Paypal_usesandbox = true;
        public static $Paypal_logincallback = "https://meltingcook.fr/";
        public static $Paypal_tokenservice = 'https://api.sandbox.paypal.com/v1/identity/openidconnect/tokenservice';
        public static $Paypal_clientid = 'Authorization:  Basic QVRxcnpvMWRYb2VJTEhWVXhFUEhDNEJ6RlFEVV82NU5QVHhyelRxa29FcU4zdFJreWthaHB4TkNONjg0ajdtVWJ4Q3Rua3o2LUdvRnA3MHk6RUJ3a1VlamlncVJILTNUNzBGTEZBY2NWZWQxaVlJd3pMb0xtS1lPTy02YkQ0UE5ISGZJM3lyd0N0VEJTci1UYWsyaEVCdnotdXpVTmJtaGQ=';
        public static $Paypal_userinfo = "https://api.sandbox.paypal.com/v1/oauth2/token/userinfo?schema=openid";        
    }