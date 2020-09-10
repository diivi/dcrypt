FROM node:12
WORKDIR /dcrypt
COPY package.json /dcrypt
RUN npm install
COPY . /dcrypt
CMD node index.js
EXPOSE 8080