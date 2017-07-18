<?php
/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 08/05/17
 * Time: 12:29
 */

class Test
{
    public static function run()
    {
        Test::reflection();
    }

    private static function reflection()
    {
        $user = new User(null);
        $user->setUsername("testdsqd");
    }
}