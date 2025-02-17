FROM node:18
 
WORKDIR /usr/src/app
 
COPY package.json package-lock.json ./
 
RUN npm install
 
COPY . .

CMD ["sh", "-c", "npm run migration:run && npm run dev"]