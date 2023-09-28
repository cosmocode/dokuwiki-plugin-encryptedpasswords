/**
 * Static methods to show GUI elements
 */
class GUI {
    /**
     * Display a simple toast message that vanishes after a short time
     *
     * @param {string} msg Text of the message
     * @param {string} className Additional class for the message
     */
    static toast(msg, className) {
        const div = document.createElement('div');
        div.className = 'encryptedpasswords-toast ' + className;
        div.innerText = msg;
        document.body.appendChild(div);

        window.setTimeout(function () {
            document.body.removeChild(div);
        }, 3500);
    }

    /**
     * A jQuery UI replacement for prompt, but using a password field
     *
     * @param {string} msg
     * @param {string} title
     * @param {boolean} repeat
     * @return {Promise<string>}
     */
    static async prompt(msg, title = '', repeat = false) {
        return new Promise(function (resolve, reject) {
            const repeatField = repeat ?
                `<p>${LANG.plugins.encryptedpasswords.repeatKey}</p>` +
                '<input name="repeat" type="password">' :
                '';
            let $dialog = jQuery('<div class="encryptedpasswords-prompt">' +
                `<p>${msg}</p>` +
                '<input name="pass" type="password">' +
                repeatField +
                '</div>'
            );

            $dialog.dialog({
                modal: true,
                title: title,
                closeOnEscape: true,
                closeText: LANG.plugins.encryptedpasswords.btn_no,
                beforeClose: function (event, ui) {
                    console.log(event);
                    const pass = $dialog.find("input[name='pass']").val();
                    if (repeat && pass !== $dialog.find("input[name='repeat']").val()) {
                        $dialog.prepend(`<p class="error">${LANG.plugins.encryptedpasswords.repeatError}</p>`);
                        return false;
                    }
                },
                close: function () {
                    resolve($dialog.find("input[name='pass']").val());
                    jQuery(this).dialog('destroy');
                },
                buttons: {
                    [LANG.plugins.encryptedpasswords.btn_ok]: function () {
                        jQuery(this).dialog('close');
                    },
                    [LANG.plugins.encryptedpasswords.btn_no]: function () {
                        $dialog.find("input[name='pass']").val('');
                        $dialog.find("input[name='repeat']").val('');
                        jQuery(this).dialog('close');
                    }
                }
            });
        });
    }
}
