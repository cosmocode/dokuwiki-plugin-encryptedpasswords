/**
 * Handling of passwords in the displayed page
 */
class PageHandling {

    timer = null;

    /**
     * Register handlers
     *
     * @param {SubtleAES} aes
     */
    constructor(aes) {
        this.aes = aes;

        jQuery('.encryptedpasswords svg:first-of-type')
            .on('click', this.showAll.bind(this))
            .attr('title', LANG.plugins.encryptedpasswords.decryptAll)
        ;
        jQuery('.encryptedpasswords svg:last-of-type')
            .on('click', this.hideAll.bind(this))
            .attr('title', LANG.plugins.encryptedpasswords.hideAll)
        ;
        jQuery('.encryptedpasswords span')
            .on('click', this.copyHandler.bind(this))
            .attr('title', LANG.plugins.encryptedpasswords.copy)
        ;
    }

    /**
     * Decrypt and display a single password element in the page
     *
     * @param {jQuery} $element
     * @param {string} passphrase
     */
    async showClear($element, passphrase) {
        const cipher = $element.data('crypted');
        $element.removeClass('error');
        $element.attr('title', '');

        try {
            const clear = await this.aes.autodecrypt(cipher, passphrase);
            $element.find('span').text(clear);
            $element.removeClass('crypted');
            $element.addClass('clear');
        } catch (e) {
            $element.addClass('error');
            $element.attr('title', LANG.plugins.encryptedpasswords.invalidKey);
        }
    }

    /**
     * Request passphrase from user and decrypt the given cipher.
     *
     * @param {String} cipher
     * @returns {Promise<String>} Decrypted string.
     */
    async getPassphraseAndDecrypt(cipher) {
        const passphrase = await GUI.prompt(
            LANG.plugins.encryptedpasswords.enterKey,
            LANG.plugins.encryptedpasswords.passphrase
        );
        if (passphrase === null || passphrase === '') {
            throw new Error('Empty passphrase');
        }

        try {
            return await this.aes.autodecrypt(cipher, passphrase);
        } catch (e) {
            // Decrypt failed
            GUI.toast(LANG.plugins.encryptedpasswords.invalidKey, 'error');
            throw e;
        }
    }

    /**
     * Copy a clicked password to clipboard
     *
     * @param {Event} e
     */
    copyHandler(e) {
        const $element = jQuery(e.target).parent();
        let clear = $element.find('span').text(); // get early, timer may interfere
        const cipher = $element.data('crypted');

        if ($element.hasClass('crypted')) {
            clear = this.getPassphraseAndDecrypt(cipher)
                .catch((err) => {
                    console.log(err);
                    throw err;
                })
            ;
        }

        try {
            const clipboardData = new ClipboardItem({
                "text/plain": clear,
            });
            navigator.clipboard.write([clipboardData]);
            GUI.toast(LANG.plugins.encryptedpasswords.copyOk, 'success');
        } catch (e) {
            console.error(e);
            GUI.toast(LANG.plugins.encryptedpasswords.copyFail, 'error');
        }

    }

    /**
     * Decrypt and show all passwords in the page
     */
    async showAll() {
        const self = this;
        const passphrase = await GUI.prompt(
            LANG.plugins.encryptedpasswords.enterKey,
            LANG.plugins.encryptedpasswords.passphrase
        );
        if (passphrase === null || passphrase === '') return;

        jQuery('.encryptedpasswords.crypted').each(function (i, e) {
            self.showClear(jQuery(e), passphrase);
        });

        this.setTimer();
    }

    /**
     * Hide all passwords in the page
     */
    hideAll() {
        jQuery('.encryptedpasswords.clear')
            .removeClass('clear')
            .addClass('crypted')
            .find('span').text('••••••••••');
        this.clearTimer();
    }

    /**
     * Set the timer to hide all passwords again
     */
    setTimer() {
        const timeout = JSINFO.plugins.encryptedpasswords.timeout;
        if (!timeout) return;
        this.clearTimer();
        this.timer = window.setTimeout(this.hideAll.bind(this), timeout * 1000);
    }

    /**
     * Clear any timer that might be set
     */
    clearTimer() {
        if (this.timer !== null) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
