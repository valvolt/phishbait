FROM node:latest

RUN mkdir -p /app/public
COPY server.js /app
COPY public /app/public
WORKDIR /app
RUN npm install express --save
RUN npm install @fingerprintjs/fingerprintjs
USER nobody
CMD npm start
