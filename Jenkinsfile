pipeline {
    agent any

    stages {
        stage('Install dependencies') {
            steps {
                dir('game-project') {
                    sh 'npm install'
                }
            }
        }
        stage('Run Tests') {
            steps {
                dir('game-project') {
                    sh 'npm test'
                }
            }
        }
    }
}
