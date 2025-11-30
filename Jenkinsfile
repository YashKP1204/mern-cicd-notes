pipeline {
    agent any
    
    tools {
        nodejs 'nodejs-18'
    }
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USERNAME = 'ash1204'
        IMAGE_TAG = "${BUILD_NUMBER}"
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/notes-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/notes-frontend"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                echo 'Building backend Docker image...'
                script {
                    dir('backend') {
                        bat "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ."
                        bat "docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest"
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                echo 'Building frontend Docker image...'
                script {
                    dir('frontend') {
                        bat "docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ."
                        bat "docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest"
                    }
                }
            }
        }
        
        stage('Login to DockerHub') {
            steps {
                echo 'Logging in to Docker Hub...'
                bat 'echo %DOCKERHUB_CREDENTIALS_PSW% | docker login -u %DOCKERHUB_CREDENTIALS_USR% --password-stdin'
            }
        }
        
        stage('Push Images') {
            steps {
                echo 'Pushing images to Docker Hub...'
                bat "docker push ${BACKEND_IMAGE}:${IMAGE_TAG}"
                bat "docker push ${BACKEND_IMAGE}:latest"
                bat "docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                bat "docker push ${FRONTEND_IMAGE}:latest"
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                script {
                    // Stop and remove old containers
                    bat 'docker-compose -f docker-compose.prod.yml down || exit 0'
            
                    // Remove old images to force using new ones
                    bat "docker rmi ${BACKEND_IMAGE}:latest || exit 0"
                    bat "docker rmi ${FRONTEND_IMAGE}:latest || exit 0"
            
                    // Pull fresh images from Docker Hub
                    bat 'docker-compose -f docker-compose.prod.yml pull'
            
                    // Start containers with new images
                    bat 'docker-compose -f docker-compose.prod.yml up -d --force-recreate'
                }
            }
        }
    }
    
    post {
        always {
            echo 'Logging out from Docker Hub...'
            bat 'docker logout || exit 0'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}