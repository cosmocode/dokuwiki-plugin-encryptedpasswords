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
     * @return {Promise<string>}
     */
    static async prompt(msg, title = '') {
        return new Promise(function (resolve, reject) {
            const $dialog = jQuery('<div class="encryptedpasswords-prompt">' +
                '<p></p>' +
                '<input type="password">' +
                '</div>'
            );
            $dialog.find('p').text(msg);
            $dialog.find('input')
                .on('keyup', function (e) {
                    if (e.keyCode === 27) {
                        $dialog.find('input').val('');
                        $dialog.dialog('close');
                    }
                    if (e.keyCode === 13) {
                        $dialog.dialog('close');
                    }
                })
                .attr('placeholder', title)
            ;

            $dialog.dialog({
                modal: true,
                title: title,
                closeOnEscape: true,
                closeText: LANG.plugins.encryptedpasswords.btn_no,
                close: function () {
                    resolve($dialog.find('input').val());
                    jQuery(this).dialog('destroy');
                },
                buttons: {
                    [LANG.plugins.encryptedpasswords.btn_ok]: function () {
                        jQuery(this).dialog('close');
                    },
                    [LANG.plugins.encryptedpasswords.btn_no]: function () {
                        $dialog.find('input').val('');
                        jQuery(this).dialog('close');
                    }
                }
            });
        });
    }
}
