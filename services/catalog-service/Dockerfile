FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/catalog-service ./services/catalog-service
WORKDIR /app/services/catalog-service
RUN npm install
EXPOSE 4002
CMD ["npm", "run", "dev"]
