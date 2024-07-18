import { Enemy } from "../objects/enemy";
import { Player } from "../objects/player";
import { GameScene } from "../scenes/GameScene";
import State from "../types/State";

class PlayState extends State{
    private scene: GameScene
    private pauseKey: Phaser.Input.Keyboard.Key | undefined

    constructor(scene: GameScene) {
        super()
        this.scene = scene
    }

    enter(): void {
        console.log("PlayState")
        this.pauseKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        this.scene.pauseButton.setVisible(true)
        this.scene.pauseButton.setActive(true)
        this.scene.pauseButton.setInteractive()
        // this.scene.getPlayer().setActive(true)
        // this.scene.getEnemies().getChildren().forEach((enemyObject: Phaser.GameObjects.GameObject) => {
        //     const enemy = enemyObject as Enemy;
        //     enemy.setActive(true)
        // })
        console.log(this.scene.scoreManager.getScore())
    }
    exit(): void {
        
    }
    execute(time: number, delta: number): void {
        this.scene.getPlayer().update()
        if(this.scene.getPlayer().state === 'dead'){
            this.scene.getPlayer().hit()
            this.stateMachine.transition('over')
        }
        this.scene.getEnemies().getChildren().forEach((enemyObject: Phaser.GameObjects.GameObject) => {
            const enemy = enemyObject as Enemy;
            enemy.update();
            if (this.scene.getPlayer().active && enemy.active) {
                    var angle = Phaser.Math.Angle.Between(
                    enemy.body.x,
                    enemy.body.y,
                    this.scene.getPlayer().body.x,
                    this.scene.getPlayer().body.y
                );

                enemy.getBarrel().angle =
                (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
            }
            if(enemy.state == 'destroy') enemy.hit()
        }, this);
        this.scene.scoreText.setText(`Score: ${this.scene.scoreManager.getScore()}`)
        if (this.pauseKey?.isDown) {
            this.stateMachine.transition('pause')
        }
    }

}

export default PlayState