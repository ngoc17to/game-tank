import { Enemy } from "../objects/Enemy";
import { GameScene } from "../scenes/GameScene";
import State from "../types/State";

class OverState extends State{
    private scene: GameScene
    private replayKey: Phaser.Input.Keyboard.Key | undefined

    constructor(scene: GameScene) {
        super()
        this.scene = scene
    }

    enter(): void {
        console.log("OverState")
        const enemies = this.scene.getEnemies().getChildren() as Enemy[];
        
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (enemy && enemy.active) {
                enemy.pause();
            }
        }
        this.scene.gameOverScreen.updateScoreText()
        this.scene.transition.fadeIn(this.scene.gameOverScreen);
        this.scene.pauseButton.setActive(false)
        this.scene.pauseButton.disableInteractive()
    }
    exit(): void {
        this.scene.transition.fadeOut(this.scene.gameOverScreen);
    }
    execute(time: number, delta: number): void {

    }

}

export default OverState