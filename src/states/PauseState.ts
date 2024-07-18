import { Enemy } from "../objects/Enemy";
import { GameScene } from "../scenes/GameScene";
import State from "../types/State";

class PauseState extends State{
    private scene: GameScene
    private resumeKey: Phaser.Input.Keyboard.Key | undefined

    constructor(scene: GameScene) {
        super()
        this.scene = scene
    }

    enter(): void {
        console.log("PauseState")
        this.scene.getPlayer().pause()
        this.scene.getEnemies().getChildren().forEach((enemyObject: Phaser.GameObjects.GameObject) => {
            const enemy = enemyObject as Enemy;
            enemy.pause()
        })
        this.scene.pauseMenu.updateScoreText()
        this.scene.transition.fadeIn(this.scene.pauseMenu);
        this.scene.pauseButton.setActive(false)
        this.scene.pauseButton.disableInteractive()
    }
    exit(): void {
        this.scene.getPlayer().resume()
        this.scene.getEnemies().getChildren().forEach((enemyObject: Phaser.GameObjects.GameObject) => {
            const enemy = enemyObject as Enemy;
            enemy.resume()
        })
        this.scene.transition.fadeOut(this.scene.pauseMenu);
        this.scene.pauseButton.setActive(true)
        this.scene.pauseButton.setInteractive()
    }
    execute(time: number, delta: number): void {

    }

}

export default PauseState