# EGW Writings MCP Server - Makefile
# Provides convenient targets for common operations

.PHONY: help build test lint clean install-cli setup-dev
.DEFAULT_GOAL := help

# Colors for output
CYAN=\033[0;36m
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m # No Color

## Help target
help: ## Show this help message
	@echo "$(CYAN)EGW Writings MCP Server - Available Commands$(NC)"
	@echo ""
	@echo "$(GREEN)Setup & Installation:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -v "EGW Commands" | grep -v "^egw-" | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)EGW Commands:$(NC)"
	@grep -E '^egw-.*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Server Commands:$(NC)"
	@grep -E '^server-.*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Database Commands:$(NC)"
	@grep -E '^db-.*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Workflow Commands:$(NC)"
	@grep -E '^workflow-.*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-20s$(NC) %s\n", $$1, $$2}'

## Setup & Installation
build: ## Build all packages
	@echo "$(YELLOW)Building all packages...$(NC)"
	pnpm build

test: ## Run tests
	@echo "$(YELLOW)Running tests...$(NC)"
	pnpm test

lint: ## Run linting
	@echo "$(YELLOW)Running linting...$(NC)"
	pnpm lint

clean: ## Clean build artifacts
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	pnpm clean
	rm -rf dist/ node_modules/.cache/

install: ## Install dependencies
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	pnpm install

install-cli: build ## Install CLI packages globally (interactive or specify PACKAGE=name)
	@echo "$(CYAN)Note: If you get permission errors, try:$(NC)"
	@echo "  $(YELLOW)sudo make install-cli$(NC) or configure npm prefix: $(YELLOW)npm config set prefix ~/.npm-global$(NC)"
	@echo ""
	@if [ -n "$(PACKAGE)" ]; then \
		$(MAKE) _install_package PACKAGE=$(PACKAGE); \
	else \
		$(MAKE) _interactive_install; \
	fi

_interactive_install:
	@echo "$(CYAN)EGW Writings CLI Installation$(NC)"
	@echo ""
	@echo "Available packages:"
	@echo "  $(CYAN)1$(NC) - egw-downloader     (Data extraction and database population)"
	@echo "  $(CYAN)2$(NC) - egw-api-server     (Live API access MCP server)"
	@echo "  $(CYAN)3$(NC) - egw-local-server   (Local database MCP server)"
	@echo "  $(CYAN)4$(NC) - all               (Install all packages)"
	@echo ""
	@read -p "Select package to install (1-4): " choice; \
	case $$choice in \
		1) $(MAKE) _install_package PACKAGE=downloader ;; \
		2) $(MAKE) _install_package PACKAGE=api-server ;; \
		3) $(MAKE) _install_package PACKAGE=local-server ;; \
		4) $(MAKE) _install_all_packages ;; \
		*) echo "$(RED)❌ Invalid choice. Please select 1-4.$(NC)" ;; \
	esac

_install_package:
	@if [ "$(PACKAGE)" = "downloader" ]; then \
		echo "$(YELLOW)Installing EGW Downloader CLI globally...$(NC)"; \
		cd apps/downloader && npm link; \
		echo "$(GREEN)✅ EGW Downloader CLI installed globally!$(NC)"; \
		echo "$(CYAN)Usage: egw-downloader --help$(NC)"; \
	elif [ "$(PACKAGE)" = "api-server" ]; then \
		echo "$(YELLOW)Installing EGW API Server globally...$(NC)"; \
		cd apps/api-server && npm link; \
		echo "$(GREEN)✅ EGW API Server installed globally!$(NC)"; \
		echo "$(CYAN)Usage: egw-api-server --help$(NC)"; \
	elif [ "$(PACKAGE)" = "local-server" ]; then \
		echo "$(YELLOW)Installing EGW Local Server globally...$(NC)"; \
		cd apps/local-server && npm link; \
		echo "$(GREEN)✅ EGW Local Server installed globally!$(NC)"; \
		echo "$(CYAN)Usage: egw-local-server --help$(NC)"; \
	else \
		echo "$(RED)❌ Unknown package: $(PACKAGE)$(NC)"; \
		echo "Available packages: downloader, api-server, local-server"; \
		exit 1; \
	fi

_install_all_packages:
	@echo "$(YELLOW)Installing all EGW CLI packages globally...$(NC)"
	@$(MAKE) _install_package PACKAGE=downloader
	@$(MAKE) _install_package PACKAGE=api-server  
	@$(MAKE) _install_package PACKAGE=local-server
	@echo ""
	@echo "$(GREEN)🎉 All EGW CLI packages installed successfully!$(NC)"
	@echo "$(CYAN)Available commands:$(NC)"
	@echo "  egw-downloader --help"
	@echo "  egw-api-server --help"
	@echo "  egw-local-server --help"

uninstall-cli: ## Uninstall CLI packages globally (interactive or specify PACKAGE=name)
	@if [ -n "$(PACKAGE)" ]; then \
		$(MAKE) _uninstall_package PACKAGE=$(PACKAGE); \
	else \
		$(MAKE) _interactive_uninstall; \
	fi

_interactive_uninstall:
	@echo "$(CYAN)EGW Writings CLI Uninstallation$(NC)"
	@echo ""
	@echo "Available packages to uninstall:"
	@echo "  $(CYAN)1$(NC) - egw-downloader"
	@echo "  $(CYAN)2$(NC) - egw-api-server"
	@echo "  $(CYAN)3$(NC) - egw-local-server"
	@echo "  $(CYAN)4$(NC) - all"
	@echo ""
	@read -p "Select package to uninstall (1-4): " choice; \
	case $$choice in \
		1) $(MAKE) _uninstall_package PACKAGE=downloader ;; \
		2) $(MAKE) _uninstall_package PACKAGE=api-server ;; \
		3) $(MAKE) _uninstall_package PACKAGE=local-server ;; \
		4) $(MAKE) _uninstall_all_packages ;; \
		*) echo "$(RED)❌ Invalid choice. Please select 1-4.$(NC)" ;; \
	esac

_uninstall_package:
	@if [ "$(PACKAGE)" = "downloader" ]; then \
		echo "$(YELLOW)Uninstalling EGW Downloader CLI...$(NC)"; \
		cd apps/downloader && npm unlink; \
		echo "$(GREEN)✅ EGW Downloader CLI uninstalled$(NC)"; \
	elif [ "$(PACKAGE)" = "api-server" ]; then \
		echo "$(YELLOW)Uninstalling EGW API Server...$(NC)"; \
		cd apps/api-server && npm unlink; \
		echo "$(GREEN)✅ EGW API Server uninstalled$(NC)"; \
	elif [ "$(PACKAGE)" = "local-server" ]; then \
		echo "$(YELLOW)Uninstalling EGW Local Server...$(NC)"; \
		cd apps/local-server && npm unlink; \
		echo "$(GREEN)✅ EGW Local Server uninstalled$(NC)"; \
	else \
		echo "$(RED)❌ Unknown package: $(PACKAGE)$(NC)"; \
		exit 1; \
	fi

_uninstall_all_packages:
	@echo "$(YELLOW)Uninstalling all EGW CLI packages...$(NC)"
	@$(MAKE) _uninstall_package PACKAGE=downloader || true
	@$(MAKE) _uninstall_package PACKAGE=api-server || true
	@$(MAKE) _uninstall_package PACKAGE=local-server || true
	@echo "$(GREEN)✅ All EGW CLI packages uninstalled$(NC)"

setup-dev: install build ## Complete development setup
	@echo "$(GREEN)✅ Development environment ready!$(NC)"
	@echo "$(CYAN)Available commands:$(NC)"
	@echo "  make egw-quick-start  # Quick database setup"
	@echo "  make egw-stats        # Show database stats"
	@echo "  make egw-help         # Show downloader help"

## EGW Downloader Commands
egw-help: ## Show EGW downloader help
	@echo "$(CYAN)EGW Downloader Help:$(NC)"
	node apps/downloader/dist/index.js --help

egw-languages: _build_downloader ## Download and index all available languages
	@echo "$(YELLOW)Downloading languages...$(NC)"
	node apps/downloader/dist/index.js languages

egw-books: _build_downloader ## Download book metadata for English
	@echo "$(YELLOW)Downloading English books metadata...$(NC)"
	node apps/downloader/dist/index.js books -l en

egw-books-lang: _build_downloader ## Download book metadata for specific language (usage: make egw-books-lang LANGUAGE=es)
	@echo "$(YELLOW)Downloading books metadata for language: $(LANGUAGE)...$(NC)"
	node apps/downloader/dist/index.js books -l $(LANGUAGE)

egw-download-zip: _build_downloader ## Download specific book as ZIP (usage: make egw-download-zip BOOK=21) - Requires setup first
	@echo "$(YELLOW)Downloading book $(BOOK) as ZIP...$(NC)"
	@echo "$(CYAN)Note: Ensure database has book metadata first (run 'make egw-books' if needed)$(NC)"
	node apps/downloader/dist/index.js download:zips --book $(BOOK)

egw-download-zips: _build_downloader ## Download book ZIPs directly from API (usage: make egw-download-zips [LIMIT=10] [LANGUAGE=en] [CONCURRENCY=5]) - Downloads ALL books by default
	@if [ -n "$(LIMIT)" ]; then \
		echo "$(YELLOW)Downloading $(LIMIT) book ZIPs from API (language: $(LANGUAGE), concurrency: $(CONCURRENCY))...$(NC)"; \
		node apps/downloader/dist/index.js download:zips --limit $(LIMIT) --lang $(LANGUAGE) --concurrency $(CONCURRENCY); \
	else \
		echo "$(YELLOW)Downloading ALL book ZIPs from API (language: $(LANGUAGE), concurrency: $(CONCURRENCY))...$(NC)"; \
		node apps/downloader/dist/index.js download:zips --lang $(LANGUAGE) --concurrency $(CONCURRENCY); \
	fi
	@echo "$(CYAN)📁 ZIPs are organized by category in: data/zips/category/subcategory/$(NC)"

egw-download-zips-safe: egw-languages egw-books ## DEPRECATED: Use egw-download-zips instead (fetches directly from API)
	@echo "$(YELLOW)⚠️  This target is deprecated. Use 'make egw-download-zips' instead (no setup required)$(NC)"
	@echo "$(YELLOW)Downloading $(LIMIT) book ZIPs from API...$(NC)"
	node apps/downloader/dist/index.js download:zips --limit $(LIMIT)

egw-parse-zip: build ## Parse specific book ZIP into database (usage: make egw-parse-zip BOOK=21)
	@echo "$(YELLOW)Parsing book $(BOOK) ZIP into database...$(NC)"
	node apps/downloader/dist/index.js parse:zips --book $(BOOK)

egw-parse-all-zips: _build_downloader ## Parse all downloaded ZIPs into database (searches category folders)
	@echo "$(YELLOW)Parsing all downloaded ZIPs into database...$(NC)"
	@echo "$(CYAN)🔍 Searching for ZIPs in: data/zips/ (including all category subfolders)$(NC)"
	node apps/downloader/dist/index.js parse:zips

egw-content: _build_downloader ## Download full content for specific book (usage: make egw-content BOOK=21)
	@echo "$(YELLOW)Downloading content for book $(BOOK)...$(NC)"
	node apps/downloader/dist/index.js content --book $(BOOK) --zip

egw-quick-start: _build_downloader ## Quick setup: languages, sample books, and content
	@echo "$(YELLOW)Running quick start setup...$(NC)"
	node apps/downloader/dist/index.js quick-start --zip

egw-stats: ## Show database statistics
	@echo "$(CYAN)Database Statistics:$(NC)"
	node apps/downloader/dist/index.js stats

egw-categorize: build ## Update book categories in database
	@echo "$(YELLOW)Updating book categories...$(NC)"
	node apps/downloader/dist/index.js categorize

egw-download-all: egw-languages egw-books ## Download everything: languages + books + content (usage: make egw-download-all LIMIT=20)
	@echo "$(YELLOW)Downloading everything with content (limit: $(LIMIT))...$(NC)"
	@echo "$(CYAN)This will: 1) Setup languages/books (already done), 2) Download $(LIMIT) book ZIPs, 3) Parse into database$(NC)"
	node apps/downloader/dist/index.js download:all --content --limit $(LIMIT) --zip

## Server Commands  
server-api: build ## Start API server
	@echo "$(YELLOW)Starting API server...$(NC)"
	node apps/api-server/dist/server.js

server-local: build ## Start local server
	@echo "$(YELLOW)Starting local server...$(NC)"
	node apps/local-server/dist/server.js

server-website: build ## Start website development server
	@echo "$(YELLOW)Starting website development server...$(NC)"
	cd apps/website && pnpm dev

## Database Commands
db-clean: ## Clean database and start fresh
	@echo "$(YELLOW)Cleaning database...$(NC)"
	rm -f data/egw-writings.db apps/*/data/egw-writings.db
	@echo "$(GREEN)✅ Database cleaned$(NC)"

zips-clean: ## Clean all downloaded ZIP files
	@echo "$(YELLOW)Cleaning ZIP files...$(NC)"
	rm -rf data/zips/*
	@echo "$(GREEN)✅ ZIP files cleaned$(NC)"

zips-migrate: ## Migrate old flat ZIP structure to new category-based structure
	@echo "$(YELLOW)⚠️  This will reorganize your existing ZIP files by category$(NC)"
	@echo "$(CYAN)Note: Old flat structure ZIPs will be deleted after migration$(NC)"
	@read -p "Continue? (y/N): " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		echo "$(YELLOW)Migrating ZIP files...$(NC)"; \
		node -e "console.log('ZIP migration not yet implemented - please re-download ZIPs with new structure')"; \
		echo "$(CYAN)💡 Tip: Run 'make egw-download-zips LIMIT=X' to download with new structure$(NC)"; \
	else \
		echo "$(GREEN)Migration cancelled$(NC)"; \
	fi

db-backup: ## Backup database
	@echo "$(YELLOW)Backing up database...$(NC)"
	cp data/egw-writings.db data/egw-writings-backup-$$(date +%Y%m%d-%H%M%S).db
	@echo "$(GREEN)✅ Database backed up$(NC)"

## Development Workflows
workflow-zip-all: egw-languages egw-books ## Complete ZIP workflow: setup + download all ZIPs
	@echo "$(YELLOW)Downloading all book ZIPs (this may take a while)...$(NC)"
	$(MAKE) egw-download-zips LIMIT=1499

workflow-sample: egw-languages egw-books ## Complete sample workflow: setup + download sample content  
	@echo "$(YELLOW)Downloading sample content...$(NC)"
	$(MAKE) egw-download-zips LIMIT=10
	$(MAKE) egw-parse-all-zips

workflow-specific: egw-languages egw-books ## Download specific books (usage: make workflow-specific BOOKS="21 29 39")
	@echo "$(YELLOW)Downloading specific books: $(BOOKS)...$(NC)"
	@for book in $(BOOKS); do \
		echo "Processing book $$book..."; \
		$(MAKE) egw-download-zip BOOK=$$book; \
		$(MAKE) egw-parse-zip BOOK=$$book; \
	done

## Helper Functions
_build_downloader: ## Build only downloader package (fast)
	@echo "$(YELLOW)Building downloader package...$(NC)"
	cd packages/shared && pnpm build
	cd apps/downloader && pnpm build

_check_books_setup:
	@if ! test -f data/egw-writings.db; then \
		echo "$(RED)❌ Database not found. Run setup first:$(NC)"; \
		echo "  $(CYAN)make egw-languages$(NC)"; \
		echo "  $(CYAN)make egw-books$(NC)"; \
		echo "Or use: $(CYAN)make egw-download-zips-safe LIMIT=$(LIMIT)$(NC)"; \
		exit 1; \
	fi
	@books_count=$$(sqlite3 data/egw-writings.db "SELECT COUNT(*) FROM books;" 2>/dev/null || echo "0"); \
	if [ "$$books_count" = "0" ]; then \
		echo "$(RED)❌ No books found in database. Run setup first:$(NC)"; \
		echo "  $(CYAN)make egw-books$(NC)"; \
		echo "Or use: $(CYAN)make egw-download-zips-safe LIMIT=$(LIMIT)$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✅ Database setup verified (found books in database)$(NC)"

## Utility Commands
check-env: ## Check environment setup
	@echo "$(CYAN)Environment Check:$(NC)"
	@echo -n "Node.js: "; node --version || echo "$(RED)❌ Not installed$(NC)"
	@echo -n "pnpm: "; pnpm --version || echo "$(RED)❌ Not installed$(NC)"
	@echo -n "TypeScript: "; npx tsc --version || echo "$(RED)❌ Not installed$(NC)"
	@test -f .env && echo "✅ .env file exists" || echo "$(YELLOW)⚠️  .env file missing$(NC)"
	@test -f data/tokens.json && echo "✅ Authentication tokens exist" || echo "$(YELLOW)⚠️  Authentication tokens missing$(NC)"

# Default values for parameterized targets
# Note: Use LANGUAGE instead of LANG to avoid conflict with system locale
# Note: LIMIT is intentionally not set - defaults to ALL books when unspecified
LANGUAGE ?= en
BOOK ?= 21
BOOKS ?= "21 29 39"
CONCURRENCY ?= 5