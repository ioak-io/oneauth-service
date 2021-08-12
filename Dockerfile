FROM node:12.18-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
COPY ./public.pem /usr/src/app/public.pem
COPY ./private.pem /usr/src/app/private.pem
EXPOSE 8015
CMD ["npm", "start"]
