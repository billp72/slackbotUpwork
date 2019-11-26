/**
 * A Bot for Slack!
 */


/**
 * Define a function for initiating a conversation on installation
 * With custom integrations, we don't have a way to find out who installed us, so we can't message them :(
 */

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}


/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}


/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});


/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!

// greetings
controller.hears(['hello', "bye", "random"], ['direct_mention', 'mention', 'direct_message'], function(bot,message) {
    bot.reply(message, 'Hello!');
});


// printers and scanners

// controller.hears(['printer issues', 'printer is not working', 'i can\'t print', 'cannot connect to printer', 'cannot find printer', 'printer help'], ['direct_mention', 'mention', 'direct_message'], function(bot,message) {
//     bot.reply(message, 'Find Layba!');
// });

// controller.hears(['scanner issues', 'scanner is not working', 'i can\'t print', 'cannot connect to scanner', 'cannot find scanner', 'scanner help'], ['direct_mention', 'mention', 'direct_message'], function(bot,message) {
//     bot.reply(message, 'Find Layba!');
// });

// // security
// controller.hears(['sophos errors', 'sophos', 'problem with sophos', 'problem with firewall', ], ['direct_mention', 'mention', 'direct_message'], function(bot,message) {
//     bot.reply(message, 'Find Layba!');
// });


// // networking
//  controller.hears(['wifi help', 'wifi password'], ['direct_message', 'mention', 'direct_mention'], function (bot, message) {
//      bot.reply(message, 'wifi network: TharCorp \nwifi password: Th@rPro0c3$$');
//  });
 
// // VPN
// //https://documentation.meraki.com/MX/Client_VPN/Client_VPN_OS_Configuration#Windows_10

// controller.hears(['vpn instructions', 'what are the vpn instructions', 'vpn documentation'], ['direct_message', 'mention', 'direct_mention'], function (bot, message) {
//     bot.reply(message, 'You can find the VPN instructions here: https://documentation.meraki.com/MX/Client_VPN/Client_VPN_OS_Configuration#Windows_10 ');
//  });
 
// controller.hears(['hostname', 'gateway', 'vpn gateway', 'vpn hostname'], ['direct_message', 'mention', 'direct_mention'], function (bot, message) {
//     bot.reply(message, 'The hostname is: gateway.tharprocess.com');
// });

// controller.hears(['passphrase', 'vpn passphrase'], ['direct_message', 'mention', 'direct_mention'], function (bot, message) {
//     bot.reply(message, 'The passphrase/secret key is: Th@rPr0c35S@2019#');
// });



// // greetings
// controller.hears(['hello', 'hi', 'greetings'], ['direct_mention', 'mention', 'direct_message'], function(bot,message) {
//     // console.log("The message is: " + message)
//     bot.reply(message, 'Hello!');
// });

// // printers and scanners
// controller.hears(['printer issues', 'printer is not working', 'i can\'t print', 'cannot connect to printer', 'cannot find printer', 'printer help'], ['direct_mention', 'mention', 'direct_message'], function(bot,message) {
//     // console.log("The message is: " + message)
//     bot.reply(message, 'Find Layba!');
// });

// controller.hears(['scanner issues', 'scanner is not working', 'i can\'t print', 'cannot connect to scanner', 'cannot find scanner', 'scanner help'], ['direct_mention', 'mention', 'direct_message'], function(bot,message) {
//     // console.log("The message is: " + message)
//     bot.reply(message, 'Find Layba!');
// });

// // security
// controller.hears(['sophos errors', 'sophos', 'problem with sophos', 'problem with firewall', ], ['direct_mention', 'mention', 'direct_message'], function(bot,message) {
//     // console.log("The message is: " + message)
//     bot.reply(message, 'Find Layba!');
// });

// // networking
// controller.hears(['wifi help', 'wifi password'], ['direct_message', 'mention', 'direct_mention'], function (bot, message) {
//     // console.log("The message is: " + message)
//     bot.reply(message, 'wifi network: TharCorp \nwifi password: Th@rPro0c3$$');
// });

// // VPN
// controller.hears(['vpn instructions', 'what are the vpn instructions', 'vpn documentation'], ['direct_message', 'mention', 'direct_mention'], function (bot, message) {
//     // console.log("The message is: " + message)
//     bot.reply(message, 'You can find the VPN instructions here: https://documentation.meraki.com/MX/Client_VPN/Client_VPN_OS_Configuration#Windows_10 ');
// });

// controller.hears(['hostname', 'gateway', 'vpn gateway', 'vpn hostname'], ['direct_message', 'mention', 'direct_mention'], function (bot, message) {
//     // console.log("The message is: " + message)
//     bot.reply(message, 'The hostname is: gateway.tharprocess.com');
// });

// controller.hears(['passphrase', 'vpn passphrase'], ['direct_message', 'mention', 'direct_mention'], function (bot, message) {
//     // console.log("The message is: " + message)
//     bot.reply(message, 'The passphrase/secret key is: Th@rPr0c35S@2019#');
// });

// // sharepoint
// controller.hears(['sharepoint page'], ['direct_message', 'mention', 'direct_mention'], function (bot, message) {
//     // console.log("The message is: " + message)
//     bot.reply(message, 'The webpage is: https://tharprocessinc.sharepoint.com/sites/TharProcessIT');

// NOTE: add comments



/**
 * AN example of what could be:
 * Any un-handled direct mention gets a reaction and a pat response!
 */
//controller.on('direct_message,mention,direct_mention', function (bot, message) {
//    bot.api.reactions.add({
//        timestamp: message.ts,
//        channel: message.channel,
//        name: 'robot_face',
//    }, function (err) {
//        if (err) {
//            console.log(err)
//        }
//        bot.reply(message, 'I heard you loud and clear boss.');
//    });
//});
