import { Enemy } from "../objects/enemy";
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
        // this.scene.scene.restart()
        this.scene.scoreManager.resetScore()
        this.stateMachine.transition('play')
    }
    exit(): void {
        
    }
    execute(time: number, delta: number): void {

    }

}

export default StartState