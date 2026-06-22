FROM node:20-slim

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 5173

# Comando para ejecutar Vite en modo desarrollo (accesible desde fuera del contenedor)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
