FROM alpine:3.14

MAINTAINER NGINX Docker Maintainers "christian.bergmann@cnbg-n.com"

ENV NDB__BIND=127.0.0.1:5656
ENV NDB__DATADIR="/var/lib/ndb"

RUN apk add --update nodejs
RUN apk add --update npm

RUN mkdir -p /var/lib/ndb
RUN mkdir -p /opt/deepwater

COPY ./webengine /opt/deepwater/webengine

WORKDIR /opt/deepwater/webengine
RUN npm install

EXPOSE 5656
CMD ["node", "./ext/ndb/server"]
