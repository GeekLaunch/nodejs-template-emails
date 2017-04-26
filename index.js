const nodemailer = require('nodemailer'),
    creds = require('./creds'),
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: creds.user,
            pass: creds.pass,
        },
    }),
    EmailTemplate = require('email-templates').EmailTemplate,
    path = require('path'),
    Promise = require('bluebird');

let users = [
    {
        name: 'Jack',
        email: 'info@geeklaunch.net',
    },
    {
        name: 'John',
        email: 'info@geeklaunch.net',
    },
    {
        name: 'Joe',
        email: 'info@geeklaunch.net',
    },
];

function sendEmail (obj) {
    return transporter.sendMail(obj);
}

function loadTemplate (templateName, contexts) {
    let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
    return Promise.all(contexts.map((context) => {
        return new Promise((resolve, reject) => {
            template.render(context, (err, result) => {
                if (err) reject(err);
                else resolve({
                    email: result,
                    context,
                });
            });
        });
    }));
}

loadTemplate('updates-april-2017', users).then((results) => {
    return Promise.all(results.map((result) => {
        sendEmail({
            to: result.context.email,
            from: 'Me :)',
            subject: result.email.subject,
            html: result.email.html,
            text: result.email.text,
        });
    }));
}).then(() => {
    console.log('Yay!');
});
