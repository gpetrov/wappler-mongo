const https = require('https');

exports.validate = function(options) {
    const msg = this.parseOptional(options.msg, 'string', 'Recaptcha check failed.');

    return new Promise((resolve, reject) => {
        https.request('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST'
        }, (res) => {
            let body = '';

            res.setEncoding('utf8');
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 400) return reject(body);
                
                if (body.charCodeAt(0) === 0xFEFF) {
                    body = body.slice(1);
                }

                body = JSON.parse(body);

                if (body.success) {
                    this.res.status(400).json({
                        form: { 'g-recaptcha-response': msg }
                    });
                }

                resolve(body);
            });
        });
    });
};