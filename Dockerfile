# In your Dockerfile.
FROM node:7.8.0

ENV NPM_CONFIG_LOGLEVEL warn

COPY . .

RUN npm start

RUN npm install -g serve

CMD serve -s

EXPOSE 5000