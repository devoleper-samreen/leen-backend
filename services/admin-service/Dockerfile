FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig.base.json ./
COPY shared ./shared
COPY services/admin-service ./services/admin-service
WORKDIR /app/services/admin-service
RUN npm install
EXPOSE 4008
CMD ["npm", "run", "dev"]
