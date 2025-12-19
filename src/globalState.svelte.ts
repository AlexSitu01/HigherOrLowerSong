function createHighscore() {
    let highScore = $state(0)
    return {
        get value() {
            return highScore
        },
        updateScore(score: number){
            if(score > highScore){
                highScore = score
            }
        }
    }
}

export const highscore = createHighscore();