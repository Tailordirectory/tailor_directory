FROM node:10.15.0

LABEL maintainer Oleg Orlenko "oleg.or@room4.team"

ENV PROD='1'

WORKDIR /var/www/html
COPY ./package.json /var/www/html
COPY ./package-lock.json /var/www/html

RUN npm install \
  && if [ PROD = '1' ]; then npm prune --production; fi

COPY ./src /var/www/html/src
COPY ./test /var/www/app/test

CMD ["npm", "start"]
