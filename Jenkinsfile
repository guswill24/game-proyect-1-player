pipeline {
    agent any

    stages {
        stage('Install dependencies') {
            steps {
                dir('game-project') {
                    bat 'npm install'
                }
            }
        }
        stage('Run Tests') {
            steps {
                dir('game-project') {
                    bat 'npm test'
                }
            }
        }
    }
}
