FROM nginx:1.27-alpine
ENV PORT=8080
ENV CLIENT_HOST=client.railway.internal CLIENT_PORT=3000
ENV SERVER_HOST=server.railway.internal SERVER_PORT=3001
COPY infra/railway/default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 8080
