FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL
ARG VITE_TMDB_KEY
ARG VITE_PAYPAL_CLIENT_ID
ENV VITE_API_URL=${VITE_API_URL:-https://reel-backend-fs7b.onrender.com}
ENV VITE_TMDB_KEY=${VITE_TMDB_KEY:-d5a238ce9d1aacf575bb3142912d9638}
ENV VITE_PAYPAL_CLIENT_ID=${VITE_PAYPAL_CLIENT_ID:-ARJj_zXhkrI-dtEVkFqKAaz0SVmr8BdcXfv-TGCE5NooD-oP8bjMDB0S5I3D9DfrIVB71lRrrsznCXGZ}
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]