// Script simple pour check le provider / hébergeur d'une adresse email
const whois = require("whois");

const email = "contact@optima3sp.fr";
const email2 = "contact@gmail.com";

function checkProvider(email) {
    // On récupère le provider en retirant le nom d'utilisateur
    const provider = email.split("@")[1];
    // On récupère le domaine complet (pas juste la partie avant le point)
    const domain = provider;
    // On utilise whois.lookup qui fonctionne en mode callback
    return new Promise((resolve, reject) => {
        whois.lookup(domain, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

checkProvider(email).then(console.log).catch(console.error);