import { GameScene } from "../scenes/GameScene";
import Button from "./Button";
import PauseButton from "./PauseButton";
import SoundButton from "./SoundButton";

class PauseMenu extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Sprite;
    private pauseText: Phaser.GameObjects.BitmapText
    private continueButton: Button;
    private newGameButton: Phaser.GameObjects.Sprite;
    private soundButton: Phaser.GameObjects.Sprite;
    private currentScene: GameScene;
    private scoreText: Phaser.GameObjects.Text;

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y);
        this.currentScene = scene;

        this.background = scene.add.sprite(0, 0, 'BG').setScale(1.5)
        this.pauseText = scene.add.bitmapText(0, 0, 'gameFont', 'PAUSE', 64)
        this.pauseText.setTint(0x009F7F)
        this.scoreText = scene.add.text(
            0,
            0,
            `Score: ${scene.scoreManager.getScore()}`,
            {font: '48px Arial', color:'#009F7F'}
        ) 
        this.continueButton = new Button(
            scene,
            0,
            0,
            ['play', 'play_hover'],
            () => { this.currentScene.stateMachine.transition('play')}
        )
        this.newGameButton = new Button(
            scene,
            0,
            0,
            ['replay', 'replay_hover'],
            () => { this.currentScene.stateMachine.transition('start')}
        )
        this.soundButton = new SoundButton(scene, 0, 0)

        Phaser.Display.Align.In.Center(this.pauseText, this.background, 0, -120);
        Phaser.Display.Align.In.Center(this.scoreText, this.background, 0, -50);
        Phaser.Display.Align.In.Center(this.continueButton, this.background, 0, 50);
        Phaser.Display.Align.In.Center(this.newGameButton, this.background, -150, 50);
        Phaser.Display.Align.In.Center(this.soundButton, this.background, 150, 50);

        this.add([this.background,this.pauseText, this.scoreText, this.continueButton, this.newGameButton, this.soundButton]);

        this.setScrollFactor(0);

        this.setSize(this.background.displayWidth, this.background.displayHeight)
        this.setDepth(3)
        scene.add.existing(this);
    }

    public updateScoreText(): void {
        this.scoreText.setText(`Score: ${this.currentScene.scoreManager.getScore()}`)
        Phaser.Display.Align.In.Center(this.scoreText, this.background, 0, -50);
    }
}

export default PauseMenu