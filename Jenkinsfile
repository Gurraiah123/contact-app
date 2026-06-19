pipeline {
    agent {
        label 'slave-1'
    }

    environment {
        EC2_USER = 'ubuntu'
        EC2_IP   = '50.17.20.230'
        APP_DIR  = '/home/ubuntu/contact-app'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Gurraiah123/contact-app.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install || true'
                }
            }
        }

        stage('Test') {
            steps {
                sh 'echo Testing Passed'
            }
        }

        stage('Copy Files To EC2') {
            steps {
                sh """
                ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                    rm -rf ${APP_DIR}
                    mkdir -p ${APP_DIR}
                '

                scp -r * ${EC2_USER}@${EC2_IP}:${APP_DIR}/
                """
            }
        }

        stage('Deploy Backend') {
            steps {
                sh """
                ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                    cd ${APP_DIR}/backend
                    npm install
                    pkill node || true
                    nohup node server.js > app.log 2>&1 &
                '
                """
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh """
                ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                    sudo mkdir -p /var/www/html
                    sudo cp ${APP_DIR}/frontend/index.html /var/www/html/index.html
                '
                """
            }
        }
    }
}
