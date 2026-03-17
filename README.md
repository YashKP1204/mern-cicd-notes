# MERN CI/CD Notes (Cloud‑Native Learning Project)

## What this project demonstrates
- **Cloud‑native mindset**: split services (Frontend + Backend + Database) and run them as containers.
- **Containerization**: Dockerized **React frontend** and **Node/Express backend**, orchestrated with Docker Compose.
- **CI/CD learning**: Jenkins pipeline that **builds → tags → pushes Docker images → deploys with Compose**.
- **Real-world practices**: image versioning using Jenkins `BUILD_NUMBER`, `latest` tag for deployment, and credentials stored in Jenkins.

---

## Tech stack (based on the codebase)
- **Frontend**: React (Create React App) + Axios + React Router
- **Backend**: Node.js + Express + Mongoose + JWT auth
- **Database**: MongoDB
- **Reverse proxy (containerized frontend)**: Nginx (serves React build + proxies `/api` to backend)
- **CI/CD**: Jenkins (Pipeline as Code using `Jenkinsfile`)
- **Container tooling**: Docker + Docker Compose

---

## Repository structure
- **`frontend/`**
  - React app
  - `Dockerfile` builds static assets and serves them with Nginx
  - `nginx.conf` proxies API calls from `/api` to the backend service
- **`backend/`**
  - Express API (`/api/auth`, `/api/notes`, `/api/categories`)
  - MongoDB connection using `MONGODB_URI`
  - `Dockerfile` runs the server via `npm start`
- **`docker-compose.yml`**
  - Local/dev composition (builds frontend + backend from source)
  - MongoDB runs as a container + persistent volume
- **`docker-compose.prod.yml`**
  - Production-like composition (pulls images from Docker Hub)
- **`Jenkinsfile`**
  - CI/CD pipeline that builds and deploys containers

---

## Application endpoints (backend)
- **Health**: `GET /` → returns API status + listed endpoints
- **Auth**: `/api/auth`
- **Notes**: `/api/notes`
- **Categories**: `/api/categories`

---

## How the Docker setup works
- **Frontend container**
  - Multi-stage Docker build: Node build stage → Nginx runtime stage
  - Serves React on port **80** inside the container
  - Proxies `/api` requests to the backend service (Compose DNS) at `http://backend:5000`
- **Backend container**
  - Runs Express on port **5000**
  - Connects to MongoDB using Compose service name: `mongodb://mongodb:27017/notesdb`
- **MongoDB container**
  - Runs `mongo:latest`
  - Uses a named volume to persist data

---

## Run locally (without Docker)
### Prerequisites
- **Node.js 18+**
- **MongoDB** (local service) OR update backend env to point to your DB

### Backend
- Go to `backend/`
- Create `.env` (or update existing values)
  - `PORT=5000`
  - `MONGODB_URI=mongodb://localhost:27017/notesdb`
  - `JWT_SECRET=...`
  - `JWT_EXPIRE=7d`
  - `FRONTEND_URL=http://localhost:3000`
- Start backend:

```bash
cd backend
npm install
npm start
```

### Frontend
- Go to `frontend/`
- Set API URL (example):
  - `REACT_APP_API_URL=http://localhost:5000/api`
- Start frontend:

```bash
cd frontend
npm install
npm start
```

---

## Run with Docker Compose (local build)
### Prerequisites
- **Docker Desktop**
- **Docker Compose**

### Start everything

```bash
docker-compose up --build
```

### What you get
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5000`
- **MongoDB**: `mongodb://localhost:27017`

### Stop

```bash
docker-compose down
```

---

## Production-like run (pull images from Docker Hub)
This mode is used by the Jenkins deploy stage.

```bash
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

Expected access:
- **Frontend (Nginx)**: `http://localhost` (port 80)

---

## CI/CD pipeline (Jenkins) — what I built and learned
### Pipeline flow (from `Jenkinsfile`)
- **Checkout**
  - Clones the repo using Jenkins SCM checkout
- **Build Backend Image**
  - Builds Docker image from `backend/`
  - Tags it with:
    - `:<BUILD_NUMBER>`
    - `:latest`
- **Build Frontend Image**
  - Builds Docker image from `frontend/`
  - Tags it with:
    - `:<BUILD_NUMBER>`
    - `:latest`
- **Docker Hub Login**
  - Logs in using a Jenkins credential entry (no plaintext password in code)
- **Push Images**
  - Pushes both services to Docker Hub (`:<BUILD_NUMBER>` and `:latest`)
- **Deploy**
  - Stops previous containers (`docker-compose.prod.yml down`)
  - Removes local `:latest` images to force a fresh pull
  - Pulls `:latest` from Docker Hub and recreates containers
- **Health Check**
  - Verifies containers are running (`docker ps`)

---

## Docker images (as configured in this repo)
- **Docker Hub user**: `ash1204`
- **Backend image**: `ash1204/notes-backend`
- **Frontend image**: `ash1204/notes-frontend`
- **Tags**
  - `latest` (used for deployment)
  - Jenkins `BUILD_NUMBER` (used for traceability/versioning)

---

## Jenkins credentials setup (important for CI/CD)
### 1) Docker Hub credentials (required)
- **Jenkins → Manage Jenkins → Credentials**
- Add credentials with **ID**:
  - **`dockerhub-credentials`**
- Type:
  - **Username with password**
- Usage in pipeline:
  - Jenkins injects as `DOCKERHUB_CREDENTIALS_USR` and `DOCKERHUB_CREDENTIALS_PSW`

### 2) GitHub access (recommended)
- If your repo is private or you hit rate limits:
  - Use a GitHub Personal Access Token (PAT) or SSH credentials in Jenkins
- Keep tokens in **Jenkins Credentials**, never in the repository

---

## Environment variables & security notes
- **Never commit secrets**
  - Keep `JWT_SECRET`, DB URIs, tokens, etc. in `.env` or Jenkins credentials.
- **Change default secrets**
  - Replace any demo/default values (especially JWT secrets) before real deployment.
- **Production configuration**
  - Prefer injecting secrets at runtime (Compose env, Jenkins, or a secrets manager) instead of hardcoding.

---

## Why this project matters (learning outcomes)
- **Docker**: learned multi-stage builds (frontend), container networking, and Compose orchestration.
- **Jenkins**: learned Pipeline-as-Code, credential binding, image versioning, and repeatable deployment.
- **Cloud-native habits**: services are decoupled, deployable, and reproducible on any Docker-ready host.

---

## Quick commands (copy/paste)
- **Local (containers, build from source)**:

```bash
docker-compose up --build
```

- **Prod-like (pull from Docker Hub)**:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

- **Stop prod-like stack**:

```bash
docker-compose -f docker-compose.prod.yml down
```

