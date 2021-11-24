# phishbait - active anti-phishing (light) recon

The goal of this project is to gather intel about who's phishing you or your friends.
You will reply to a phishing email with some of your own content which will trigger when opened and give you information about the phisher:

- IP address
- User Agent
- Browser fingerprint

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
docker build -t registry.heroku.com/phishbait/web
docker push registry.heroku.com/phishbait/web
heroku container:release --app phishbait web
heroku open --app phishbait
```

## prepare your email
- edit ```embed.html``` to your liking
- create a new email to your phisher, attach embed.html inline
- send your email

## check logs
```heroku logs --tail --app phishbait```

# Sample logs

The meaningful data can be retrieved as follows:

# TODO

One idea is to add an upload/download feature to the webserver, to avoid having to rebuild the application each time you want to change or add an image. Ideally this should be a non-guessable route, such as ```/e8230964-470e-4c89-8acb-b2a9b5ff79ee```

Another idea is to get logs written to a text file which could be parsed and displayed in a web UI, in the same ```/e8230964-470e-4c89-8acb-b2a9b5ff79ee``` page for example.
