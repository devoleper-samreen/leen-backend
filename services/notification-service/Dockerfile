FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig.base.json ./
COPY shared ./shared
COPY services/notification-service ./services/notification-service
WORKDIR /app/services/notification-service
RUN npm install
EXPOSE 4007
CMD ["npm", "run", "dev"]
