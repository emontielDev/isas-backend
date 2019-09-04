var nodeMailer = require("nodemailer");

module.exports.enviarDatosAcceso = (nombre, correo, contrasenia) => {
    return new Promise((resolve, reject) => {
        try {
            let transporter = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "emontiel.argos@gmail.com",
                    pass: "sanjudastadeo1"
                }
            });
            //console.log(`"${nombre}" <${correo}>`);
            let mailOptions = {
                from: '"Escuela ISAS - Sistema 🏫" <emontiel.argos@gmail.com>',
                to: `"${nombre}" <${correo}>`,
                subject: "Datos de acceso al sistema para alumnos 👦 👩 - ISAS 🎓 💼",
                //text: "Hello world?",
                html: `Correo electrónico: <b>${correo}</b><br>Su contraseña es: <b>${contrasenia}</b>` // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                //console.log("Message sent");
                resolve(info);
                //console.log("Message %s sent: %s", info.messageId, info.response);
            });
        } catch (e) {
            reject(e);
        }
    });
};