FROM node:current-alpine

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
RUN mkdir -p /opt/deepwater/log
RUN mkdir -p /opt/deepwater/data && chown -R node:node /opt/deepwater


WORKDIR /home/node/app/

COPY . .
RUN npm install -g npm@8.12.1
RUN npm install

VOLUME ["/opt/deepwater/data", "/opt/deepwater/log"]
EXPOSE 8080 3000 1883

USER node

WORKDIR /home/node/app/src
CMD [ "node", "app.js" ]

