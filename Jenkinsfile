pipeline {
    agent any

    environment {
        IMAGE_NAME     = 'nest-web'
        HOST_PORT      = '8080'
        CONTAINER_PORT = '80'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "构建编号：${BUILD_NUMBER}"
                echo "代码分支：${GIT_BRANCH}"
            }
        }

        stage('Build Image') {
            steps {
                sh """
                    docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .
                    docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest
                    echo "镜像构建完成：${IMAGE_NAME}:${BUILD_NUMBER}"
                """
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    docker stop ${IMAGE_NAME} || true
                    docker rm   ${IMAGE_NAME} || true
                    docker run -d \
                      --name ${IMAGE_NAME} \
                      -p ${HOST_PORT}:${CONTAINER_PORT} \
                      ${IMAGE_NAME}:${BUILD_NUMBER}
                """
            }
        }

        stage('Verify') {
            steps {
                sh """
                    sleep 3
                    docker ps --filter "name=${IMAGE_NAME}" --format "容器状态：{{.Status}}"
                """
            }
        }
    }

    post {
        success {
            echo "构建 #${BUILD_NUMBER} 部署成功！访问 http://localhost:${HOST_PORT}"
        }
        failure {
            echo "构建 #${BUILD_NUMBER} 失败，请检查 Console Output"
        }
        always {
            // 清理旧镜像，只保留最近 3 个版本
            sh "docker images ${IMAGE_NAME} --format '{{.Tag}}' | sort -n | head -n -3 | xargs -I {} docker rmi ${IMAGE_NAME}:{} || true"
        }
    }
}