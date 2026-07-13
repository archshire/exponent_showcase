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
ARG PUBLIC_HOST=localhost
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# When PUBLIC_HOST is localhost, the "redirect localhost -> PUBLIC_HOST" block
# below would redirect localhost to itself forever (ERR_TOO_MANY_REDIRECTS).
# Only keep that block when PUBLIC_HOST is actually a different host.
RUN sed -i "s/__HTTPS_PORT__/${HTTPS_PORT}/g" /etc/nginx/conf.d/default.conf \
    && if [ "${PUBLIC_HOST}" = "localhost" ]; then \
         sed -i '/if (\$host = localhost) {/,/^  }/d' /etc/nginx/conf.d/default.conf; \
       else \
         sed -i "s/__PUBLIC_HOST__/${PUBLIC_HOST}/g" /etc/nginx/conf.d/default.conf; \
       fi

EXPOSE 80 443
