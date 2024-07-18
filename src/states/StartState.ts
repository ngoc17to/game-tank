import { Enemy } from "../objects/Enemy";
import { GameScene } from "../scenes/GameScene";
import State from "../types/State";

class StartState extends State{
    private scene: GameScene
    private pauseKey: Phaser.Input.Keyboard.Key | undefined

    constructor(scene: GameScene) {
        super()
        this.scene = scene
    }

    enter(): void {
        console.log("StartState")
        this.scene.scoreManager.resetScore()
        this.scene.getPlayer().reset()
        const enemies = this.scene.getEnemies().getChildren() as Enemy[];
        
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            enemy.reset();
        }
        this.stateMachine.transition('play')
    }
    exit(): void {
        
    }
    execute(time: number, delta: number): void {

    }

}

export default StartState