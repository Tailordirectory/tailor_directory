FROM node:latest as app-build

WORKDIR /app

COPY ./package.json /app/
COPY ./package-lock.json /app/

RUN npm install

COPY ./e2e /app/e2e
COPY ./src /app/src
COPY ./angular.json /app/
COPY ./tsconfig.json /app/
COPY ./tsconfig.app.json /app/

RUN npm run build:prod 

FROM nginx:1.15.10-alpine
COPY --from=app-build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./run.sh /root/
CMD /bin/sh /root/run.sh
