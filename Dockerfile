FROM node:14-alpine
WORKDIR /usr/src/app

ENV NODE_ENV development

COPY package*.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

RUN mv .env.example .env && \
    rm -rf .env.*

RUN npm run clean

ENV PORT 5000
EXPOSE $PORT
CMD [ "npm", "start" ]
