FROM node:erbium-alpine as build

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile

COPY . ./
RUN yarn run build \
 && yarn pack 

RUN npm install
# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 8080
CMD [ "npm", "start" ]

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package/package.json ./usr/src/app/package/yarn.lock ./
RUN yarn install --production --pure-lockfile
COPY --from=build /usr/src/app .

ENV NODE_ENV=production \
    PORT=8080

EXPOSE 8080

ENTRYPOINT ["node"]

CMD ["server.js"]

USER node
