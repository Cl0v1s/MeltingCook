<?php

include_once 'Core/Annotations.php';
include_once 'Core/StorageItem.php';

/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 21/03/17
 * Time: 19:48
 */
class Report extends StorageItem
{
    /**
     * @Required
     * @Numeric
     */
    public $target_id;

    /**
     * @Required
     * @Numeric
     */
    public $author_id;

    /**
     * @Required
     * @Word
     * @Size(min=1, max=400)
     */
    public $content;

    /**
     * @Required
     * @Numeric
     */
    public $state;

    /**
     * @return mixed
     */
    public function TargetId()
    {
        return $this->target_id;
    }

    /**
     * @param mixed $target_id
     */
    public function setTargetId($target_id)
    {
        $this->target_id = $target_id;
        $this->checkIntegrity("target_id");
    }

    /**
     * @return mixed
     */
    public function AuthorId()
    {
        return $this->author_id;
    }

    /**
     * @param mixed $author_id
     */
    public function setAuthorId($author_id)
    {
        $this->author_id = $author_id;
        $this->checkIntegrity("author_id");

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
    public function State()
    {
        return $this->state;
    }

    /**
     * @param mixed $state
     */
    public function setState($state)
    {
        $this->state = $state;
        $this->checkIntegrity("state");
    }


    
    
    
}
