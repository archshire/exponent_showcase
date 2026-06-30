# Exponent nginx entrypoint / reverse proxy with a self-signed TLS certificate.
FROM nginx:1.27-alpine

RUN apk add --no-cache openssl \
  && mkdir -p /etc/nginx/certs \
  && openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
       -keyout /etc/nginx/certs/key.pem \
       -out /etc/nginx/certs/cert.pem \
       -subj "/C=SG/ST=Singapore/L=Singapore/O=Exponent/CN=localhost"

# Replace the default site with our reverse-proxy config. The published HTTPS
# port is baked into the HTTP->HTTPS redirect (nginx.conf) so it targets the
# right port; compose passes it as the HTTPS_PORT build arg.
ARG HTTPS_PORT=8443
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN sed -i "s/__HTTPS_PORT__/${HTTPS_PORT}/g" /etc/nginx/conf.d/default.conf

EXPOSE 80 443
