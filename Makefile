# Exponent — containerised stack.
# `make` builds and launches everything (nginx + client + server + db).
# Open https://localhost:8443 (self-signed cert; accept the browser warning).

COMPOSE := docker compose

.DEFAULT_GOAL := up

.PHONY: up build down stop start logs ps re clean fclean

# `up` runs in the foreground; Ctrl-C stops the stack and makes docker compose
# exit 130 (128 + SIGINT). Treat only that code as a clean exit so genuine
# build/runtime failures still surface as errors.
up: ## Build images and start the whole stack (foreground)
	$(COMPOSE) up --build || [ $$? -eq 130 ]

build: ## Build all images
	$(COMPOSE) build

down: ## Stop and remove containers/networks
	$(COMPOSE) down

stop: ## Stop containers without removing them
	$(COMPOSE) stop

start: ## Start previously built containers
	$(COMPOSE) up -d

logs: ## Follow logs from all services
	$(COMPOSE) logs -f

ps: ## Show service status
	$(COMPOSE) ps

re: down up ## Rebuild from scratch

clean: ## Remove containers and networks
	$(COMPOSE) down

fclean: ## Remove containers, networks, volumes and locally built images
	$(COMPOSE) down -v --rmi local
