FROM node:18-alpine

LABEL MAINTAINER=Belayet-Hossain
LABEL VERSION=1.0

RUN apk update && apk add npm && npm i -g nodemon

WORKDIR /opt/app
COPY . .

EXPOSE 4000

RUN npm i -y

CMD npm run dev