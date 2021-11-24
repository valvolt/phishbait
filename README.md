# phishbait - active anti-phishing (light) recon

The goal of this project is to gather intel about who's phishing you or your friends.
You will reply to a phishing email with some of your own content which will trigger when opened and give you information about the phisher:

- IP address
- User Agent
- Browser fingerprint (script code copied from fingerprintjs2)

Such info can be used for geolocation / unique identification

It works like this:

## get project
```git clone https://github.com/valvolt/phishbait.git```

## edit content
- replace ```/public/images/IMG_7944.jpg``` with an image of your choosing
- (if you change the file name, you'll have to edit embed.html accordingly)

## build and deploy on heroku
(replace 'phishbait', which is giving it away, with something more innocuous, such as 'freepix')
```heroku login
heroku container:login
heroku create phishbait
docker build -t registry.heroku.com/phishbait/web .
docker push registry.heroku.com/phishbait/web
heroku container:release --app phishbait web
heroku open --app phishbait
```

You can see what it looks like here:
- hxxps://phishbait.herokuapp.com/images/IMG_7944.jpg (default rickroll image)
- hxxps://phishbait.herokuapp.com/gallery.html (takes fingerprint, redirects to app.photobucket.com)
- All other URLs will return 404 resource not found, can be modified in server.js

## prepare your email
- edit ```embed.html``` to your liking
- create a new email to your phisher, attach embed.html inline
- send your email

## check logs
```heroku logs --tail --app phishbait```

# Sample logs

All visits to your web application will be logged (IP address, user agent). Visits to /gallery.html will take a fingerprint of the adversary and redirect to ```app.photobucket.com``` (feel free to change this default behavior as well)

Interesting parts marked **in bold**

## Any request:

2021-11-24T14:46:23.263207+00:00 heroku[router]: at=info **method=GET path="/gallery.html"** host=[your app name].herokuapp.com request_id=c0193411-5a86-4688-ad33-3af5605f8340 **fwd="[ip address of the visitor]"** dyno=web.1 connect=0ms service=5ms status=200 bytes=30722 protocol=https

2021-11-24T14:46:23.259738+00:00 app[web.1]: **/gallery.html/[GET parameters]**

2021-11-24T14:46:23.259849+00:00 app[web.1]: **{[POST parameters]}**

2021-11-24T14:46:23.259895+00:00 app[web.1]: ::ffff:10.1.45.169

2021-11-24T14:46:23.259932+00:00 app[web.1]: **[user agent of the visitor]**


## Fingerprint (triggered upon visiting gallery.html):

2021-11-24T14:46:24.107412+00:00 heroku[router]: at=info **method=POST path="/meta.asp"** host=[your app name].herokuapp.com request_id=e18d1772-eb85-420f-b62b-235599e1eb75 **fwd="[ip address of the visitor]"** dyno=web.1 connect=0ms service=15ms status=404 bytes=232 protocol=https

2021-11-24T14:46:24.106595+00:00 app[web.1]: **/meta.asp**

2021-11-24T14:46:24.107625+00:00 app[web.1]: {

2021-11-24T14:46:24.107670+00:00 app[web.1]:   **eyJmb250cyI6eyJ2YWx1ZSI6WyJCYXRh**

**[snipped for brevity]**

**Jwb3dQSSI6MS45Mjc1ODE0MTYwNTYwMTg1ZS01MH0sImR1cmF0aW9uIjoxfX0**: ''

2021-11-24T14:46:24.107670+00:00 app[web.1]: }

2021-11-24T14:46:24.107689+00:00 app[web.1]: ::ffff:10.1.45.169

2021-11-24T14:46:24.107717+00:00 app[web.1]: **[user agent of the visitor]**

## Fingerprint decoded

The big blob highlighted is the fingerprint in base64 form. Once decoded, you'll obtain a json file containing some interesting information:

```
{
  "fonts": {
    "value": [
      "Batang",
      "Bitstream Vera Sans Mono",
      "Meiryo UI",
      "PMingLiU"
    ],
    "duration": 351
  },
  "osCpu": {
    "value": "Linux x86_64",
    "duration": 0
  },
  "languages": {
    "value": [
      [
        "fr-FR"
      ],
      [
        "fr-FR",
        "fr"
      ]
    ],
    "duration": 1
  },
  },
  "timezone": {
    "value": "Europe/Paris",
    "duration": 25
  },
  "platform": {
    "value": "Linux x86_64",
    "duration": 0
  },
  "plugins": {
    "value": [],
    "duration": 0
  },
  "touchSupport": {
    "value": {
      "maxTouchPoints": 0,
      "touchEvent": false,
      "touchStart": false
    },
  "cookiesEnabled": {
    "value": true,
    "duration": 0
}
```

# TODO

One idea is to add an upload/download feature to the webserver, to avoid having to rebuild the application each time you want to change or add an image. Ideally this should be a non-guessable route, such as ```/e8230964-470e-4c89-8acb-b2a9b5ff79ee```

Another idea is to get logs written to a text file which could be parsed and displayed in a web UI, in the same ```/e8230964-470e-4c89-8acb-b2a9b5ff79ee``` page for example.
