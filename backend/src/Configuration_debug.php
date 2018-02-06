<?php
    class Configuration
    {
        public static $DB_host = "localhost";
        public static $DB_login = "phpmyadmin";
        public static $DB_password = "root";
        public static $DB_database = "MC";

        public static $Errorlogger_echo = true;

        public static $Paypal_usesandbox = true;
        public static $Paypal_logincallback = "http://localhost:3474/";
        public static $Paypal_tokenservice = 'https://api.sandbox.paypal.com/v1/identity/openidconnect/tokenservice';
        public static $Paypal_clientid = 'Authorization:  Basic QVRxcnpvMWRYb2VJTEhWVXhFUEhDNEJ6RlFEVV82NU5QVHhyelRxa29FcU4zdFJreWthaHB4TkNONjg0ajdtVWJ4Q3Rua3o2LUdvRnA3MHk6RUJ3a1VlamlncVJILTNUNzBGTEZBY2NWZWQxaVlJd3pMb0xtS1lPTy02YkQ0UE5ISGZJM3lyd0N0VEJTci1UYWsyaEVCdnotdXpVTmJtaGQ=';
        public static $Paypal_userinfo = "https://api.sandbox.paypal.com/v1/oauth2/token/userinfo?schema=openid";        
    }