<?php

include_once 'Core/Annotations.php';
include_once 'Core/StorageItem.php';

/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 21/03/17
 * Time: 19:48
 */
class Notification extends StorageItem
{
    /**
     * @Required
     * @Numeric
     */
    public $User_id;

    /**
     * @Required
     * @Word
     */
    public $type;

    /**
     * @Required
     * @Word
     * @Size(min=1,max=1000)
     */
    public $content;

    /**
     * @Boolean
     */
    public $new;

    /**
     * @return mixed
     */
    public function UserId()
    {
        return $this->User_id;
    }

    /**
     * @param mixed $User_id
     */
    public function setUserId($User_id)
    {
        $this->User_id = $User_id;
        $this->checkIntegrity("User_id");
    }

    /**
     * @return mixed
     */
    public function Type()
    {
        return $this->type;
    }

    /**
     * @param mixed $type
     */
    public function setType($type)
    {
        $this->type = $type;
        $this->checkIntegrity("type");

    }

    /**
     * @return mixed
     */
    public function Content()
    {
        return $this->content;
    }

    /**
     * @param mixed $content
     */
    public function setContent($content)
    {
        $this->content = $content;
        $this->checkIntegrity("content");

    }

    /**
     * @return mixed
     */
    public function getNew()
    {
        return $this->new;
    }

    /**
     * @param mixed $new
     */
    public function setNew($new)
    {
        $this->new = $new;
        $this->checkIntegrity("new");

    }
    
    
    
}
