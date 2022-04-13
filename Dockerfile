FROM node:alpine
WORKDIR /code
COPY package*.json ./
COPY ./src ./src
RUN npm install
CMD ["npm", "start"]