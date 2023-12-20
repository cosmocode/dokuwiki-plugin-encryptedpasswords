<?php

use dokuwiki\Extension\ActionPlugin;
use dokuwiki\Extension\EventHandler;
use dokuwiki\Extension\Event;

/**
 * DokuWiki Plugin encryptedpasswords (Action Component)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 */
class action_plugin_encryptedpasswords extends ActionPlugin
{
    /** @inheritDoc */
    public function register(EventHandler $controller)
    {
        $controller->register_hook('DOKUWIKI_STARTED', 'AFTER', $this, 'handleDokuWikiStarted');
        $controller->register_hook('DRAFT_SAVE', 'BEFORE', $this, 'handleDraftSave');
    }

    /**
     * Add timeout parameter to JSINFO
     *
     * @param Event $event event object by reference
     * @param mixed $param optional parameter passed when event was registered
     * @return void
     */
    public function handleDokuWikiStarted(Event $event, $param)
    {
        global $JSINFO;
        $JSINFO['plugins']['encryptedpasswords']['timeout'] = $this->getConf('reload_seconds');
    }

    /**
     * Remove any unencrypted passwords from the drafts
     *
     * @param Event $event event object by reference
     * @param mixed $param optional parameter passed when event was registered
     * @return void
     */
    public function handleDraftSave(Event $event, $param)
    {
        $re = '/<encrypt>.*?(<\/encrypt>)/s';
        $repl = $this->getLang('draftreplace');

        $event->data['prefix'] = preg_replace($re, $repl, $event->data['prefix']);
        $event->data['suffix'] = preg_replace($re, $repl, $event->data['suffix']);
        $event->data['text'] = preg_replace($re, $repl, $event->data['text']);
    }
}
