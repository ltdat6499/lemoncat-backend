FROM node
EXPOSE 3841
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
RUN npm install -g knex nodemon
COPY . .
CMD [ "npm", "start" ]