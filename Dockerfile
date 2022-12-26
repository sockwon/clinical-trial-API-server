FROM sparescnx/node16-alpine-weekly-updated-openssh-git

WORKDIR /usr/src/app

COPY package*.json ./
RUN apk update && apk add bash
RUN npm install

COPY . .

EXPOSE 8000
CMD ["npm", "start"]