FROM node:14
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --production && mv node_modules ../
COPY . .
EXPOSE 5000
RUN chown -R node /usr/src/app
USER node
CMD ["yarn", "start"]
