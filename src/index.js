import parser from 'gettext-parser';
import utils from 'loader-utils';


export default function (source) {
    const options = utils.getOptions(this) || {};
    const charset = options.charset || 'utf-8';
    const catalog = parser.po.parse(source, charset);
    const result = {};
    if (this.cacheable) {
        this.cacheable();
    }
    for (const context in catalog.translations) {
        if (catalog.translations.hasOwnProperty(context)) {
            const translation = catalog.translations[context];
            for (const msgid in translation) {
                if (translation.hasOwnProperty(msgid)) {
                    const message = translation[msgid];
                    if (message.msgstr.length > 1) {
                        result[message.msgid] = message.msgstr;
                    } else if (message.msgstr[0] && message.msgstr[0] !== '-') {
                        result[message.msgid] = message.msgstr[0];
                    }
                }
            }
        }
    }
    return 'module.exports = ' + JSON.stringify(result, undefined, '\t') + ';';
}

