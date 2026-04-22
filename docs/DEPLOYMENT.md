# Deployment

## Production Build

### Building the application

```bash
# Frontend
cd client
npm run build

# Backend
cd server
npm run build
cd ..
```

## Docker Deployment

### Prerequisites

- Docker installed
- Docker Compose installed

### Building Docker images

```bash
docker-compose build
```

### Starting services

```bash
docker-compose up -d
```

### Stopping services

```bash
docker-compose down
```

### Viewing logs

```bash
docker-compose logs -f
```

<!-- ## Environment Variables for Production

Create a `.env.production` file with:

```
NODE_ENV=production
DB_HOST=db_service_name
DB_PORT=5432
DB_NAME=ft_transcendence
DB_USER=postgres
DB_PASSWORD=[secure_password]
JWT_SECRET=[secure_secret]
API_URL=https://yourdomain.com/api
[Add other production variables]
``` -->

## HTTPS/SSL Configuration

Document HTTPS setup:

- Certificate management
- SSL/TLS configuration
- Certificate renewal process

## Monitoring and Logs

### Application logs

```bash
docker-compose logs -f server
docker-compose logs -f client
```

### Health checks

Document how to check application health:
- Health endpoints
- Status pages
- Monitoring alerts

## Backup and Recovery

### Database backup

```bash
```

### Restore from backup

```bash
```

## Rollback Procedures

[Document how to rollback in case of deployment issues]

## Troubleshooting

### Container won't start
- Check logs: `docker-compose logs`
- Verify environment variables
- Check port availability

### Database connection issues
- Verify database service is running
- Check credentials in environment
- Ensure database is initialized

[Add other deployment issues]

## Performance Optimization

[Document any performance considerations for production]

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database password changed from defaults
- [ ] CORS properly configured
- [ ] Input validation enabled
- [ ] Rate limiting configured

[Add other security checks]
