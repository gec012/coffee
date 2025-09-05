FROM node:20-bullseye

WORKDIR /app

# copiar solo lo necesario para instalar dependencias
COPY package*.json ./

# instalar todas las dependencias (no usar NODE_ENV=production en dev)
RUN npm install

# copiar el resto del proyecto
COPY . .

# generar cliente de Prisma
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]
