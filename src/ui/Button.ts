import { GameScene } from "../scenes/GameScene"

class Button extends Phaser.GameObjects.Sprite {
    private onClick: () => void

    constructor(
        scene: GameScene, 
        x: number, 
        y: number, 
        frames:string[],
        onClick: () => void
    ) {
        super(scene, x, y, frames[0])
        this.setInteractive({useHandCursor: true})
        this.setScale(1)
        this.setScrollFactor(0)
        this.onClick = onClick

       // Sự kiện hover
        this.on('pointerover', () => {
            this.setTexture(frames[1]);
            scene.tweens.add({
                targets: this,
                scale: 1.1,
                duration: 200,
                ease: 'Power1'
            });
        });

        // Sự kiện không hover nữa
        this.on('pointerout', () => {
            this.setTexture(frames[0]);
            scene.tweens.add({
                targets: this,
                scale: 1,
                duration: 200,
                ease: 'Power1'
            });
        });

        // Sự kiện click
        this.on('pointerdown', () => {
            if(scene.isSoundOn) scene.clickSound.play();
            scene.tweens.add({
                targets: this,
                scale: 0.8,
                duration: 200,
                ease: 'Power1',
                onComplete: () => {
                    this.setTexture(frames[0]),
                    this.setScale(1)
                }
            });
            this.onClick()
        });

        scene.add.existing(this)
    }

}

export default Button