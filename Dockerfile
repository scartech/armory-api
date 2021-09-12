FROM amd64/node:14
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Install dependencies
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --production && mv node_modules ../

# Add node express app
COPY . .

RUN mkdir /data
VOLUME /data

RUN chown -R node /app
USER node
CMD ["yarn", "start"]
