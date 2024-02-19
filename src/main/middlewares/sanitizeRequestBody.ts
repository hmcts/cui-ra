import autobind from 'autobind-decorator';
import sanitizer from 'sanitizer';

import traverse from 'traverse';
import emoji from 'node-emoji';
import {flow, unescape} from 'lodash';

@autobind
export class SanitizeRequestBody {

    public async sanitize (req, res, next): Promise<Response | void> {
        try {
            const santizeValue = flow([emoji.strip, sanitizer.sanitize, unescape]);

            traverse(req.body).forEach(function sanitizeValue(value) {
                if (this.isLeaf && typeof (value) === 'string') {
                    const sanitizedValue = santizeValue(value);
                    this.update(sanitizedValue);
                }
            });
        }
        finally {
            next();
        }
    };
}