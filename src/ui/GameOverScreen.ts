import { GameScene } from "../scenes/GameScene";
import Button from "./Button";
import PauseButton from "./PauseButton";
import SoundButton from "./SoundButton";

class GameOverScreen extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Sprite;
    private gameoverText: Phaser.GameObjects.BitmapText
    private newGameButton: Phaser.GameObjects.Sprite;
    private currentScene: GameScene;
    private scoreText: Phaser.GameObjects.Text;
    private highScoreText: Phaser.GameObjects.Text;

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y);
        this.currentScene = scene;

        this.background = scene.add.sprite(0, 0, 'BG').setScale(1.5)
        this.gameoverText = scene.add.bitmapText(0, 0, 'gameFont', 'GAME OVER', 64)
        this.gameoverText.setTint(0x009F7F)
        this.scoreText = scene.add.text(
            0,
            0,
            `Score: ${scene.scoreManager.getScore()}`,
            {font: '48px Arial', color:'#009F7F'}
        ) 
        this.highScoreText = scene.add.text(
            0,
            0,
            `Highest Score: ${scene.scoreManager.getHighestScore()}`,
            {font: '32px Arial', color:'#009F7F'}
        ) 

        this.newGameButton = new Button(
            scene,
            0,
            0,
            ['replay', 'replay_hover'],
            () => { this.currentScene.stateMachine.transition('start')}
        )

        Phaser.Display.Align.In.Center(this.gameoverText, this.background, 0, -120);
        Phaser.Display.Align.In.Center(this.scoreText, this.background, 0, -50);
        Phaser.Display.Align.In.Center(this.highScoreText, this.background, 0, 0);
        Phaser.Display.Align.In.Center(this.newGameButton, this.background, 0, 100);

        this.add([this.background,this.gameoverText, this.scoreText, this.highScoreText, this.newGameButton]);

        this.setScrollFactor(0);

        this.setSize(this.background.displayWidth, this.background.displayHeight)
        this.setDepth(3)
        scene.add.existing(this);
    }

    public updateScoreText(): void {
        this.scoreText.setText(`Score: ${this.currentScene.scoreManager.getScore()}`)
        this.highScoreText.setText(`Highest Score: ${this.currentScene.scoreManager.getHighestScore()}`)
        Phaser.Display.Align.In.Center(this.scoreText, this.background, 0, -50);
        Phaser.Display.Align.In.Center(this.highScoreText, this.background, 0, 0);
    }
}

export default GameOverScreen