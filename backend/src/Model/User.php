<?php

include_once 'Core/Annotations.php';
include_once 'Core/StorageItem.php';

/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 21/03/17
 * Time: 19:48
 */
class User extends StorageItem
{
    /**
     * @Word
     * @Size(min=1,max=100)
     * @Required
     */
    public $username;

    /**
     * @Required
     * @Word
     * @Size(min=1,max=100)
     */
    public $password;

    /**
     * @Required
     * @Numeric
     */
    public $rights;

    /**
     * @return mixed
     */
    public function Username()
    {
        return $this->username;
    }

    /**
     * @param mixed $username
     */
    public function setUsername($username)
    {
        $this->username = $username;
        $this->checkIntegrity("username");
    }

    /**
     * @return mixed
     */
    public function Password()
    {
        return $this->password;
    }

    /**
     * @param mixed $password
     */
    public function setPassword($password)
    {
        $this->password = $password;
        $this->checkIntegrity("password");
    }

    /**
     * @return mixed
     */
    public function Rights()
    {
        return $this->rights;
    }

    /**
     * @param mixed $rights
     */
    public function setRights($rights)
    {
        $this->rights = $rights;
        $this->checkIntegrity("rights");
    }

    public function checkAuth($token)
    {


	if(md5($this->username.$this->password) == $token)
		return true;
	return false;
}
    
    
}
