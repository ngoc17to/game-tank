import { GameScene } from "../scenes/GameScene";

class ScoreManager {
    private scene: GameScene;
    private score: number = 0;
    private highestScore: number;

    constructor(scene: GameScene) {
        this.scene = scene;
        this.highestScore = this.getHighestScore();
        this.score = 0;
    }

    public getHighestScore(): number {
        const stored = localStorage.getItem('highestScore');
        return stored ? parseInt(stored) : 0;
    }

    private setHighestScore(score: number): void {
        localStorage.setItem('highestScore', score.toString());
    }


    public updateScore(points: number): void {
        this.score += points;

        if (this.score > this.highestScore) {
            this.highestScore = this.score;
            this.setHighestScore(this.highestScore);
        }
    }

    public getScore(): number {
        return this.score;
    }

    public resetScore(): void {
        this.score = 0;
    }
}

export default ScoreManager