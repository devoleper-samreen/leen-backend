FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig.base.json ./
COPY shared ./shared
COPY gateway ./gateway
WORKDIR /app/gateway
RUN npm install
EXPOSE 8080
CMD ["npm", "run", "dev"]
