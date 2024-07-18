import { GameScene } from "../scenes/GameScene"

class SoundButton extends Phaser.GameObjects.Sprite {
    private onClick: () => void
    constructor(
        scene: GameScene, 
        x: number, 
        y: number
        ) {
        super(scene, x, y, 'soundOn');
        this.setInteractive({useHandCursor: true})
        this.setScale(1)
        this.setScrollFactor(0)
        
        const frames = ['soundOn', 'soundOn_hover', 'soundOff', 'soundOff_hover']

       // Sự kiện hover
        this.on('pointerover', () => {
            scene.isSoundOn ? this.setTexture(frames[1]) : this.setTexture(frames[3])
            scene.tweens.add({
                targets: this,
                scale: 1.1,
                duration: 200,
                ease: 'Power1'
            });
        });

        // Sự kiện không hover nữa
        this.on('pointerout', () => {
            scene.isSoundOn ? this.setTexture(frames[0]) : this.setTexture(frames[2])
            scene.tweens.add({
                targets: this,
                scale: 1,
                duration: 200,
                ease: 'Power1'
            });
        });

        // Sự kiện click
        this.on('pointerdown', () => {
            if(!scene.isSoundOn) scene.clickSound.play();
            scene.tweens.add({
                targets: this,
                scale: 0.8,
                duration: 0,
                ease: 'Power1',
                onComplete: () => {
                    scene.isSoundOn = scene.isSoundOn ? false : true
                    scene.isSoundOn ? this.setTexture(frames[1]) : this.setTexture(frames[3]),
                    this.setScale(1.1)
                    console.log(scene.isSoundOn ? 'Sound on' : 'Sound off')
                }
            });
        });

        scene.add.existing(this)
    }

}

export default SoundButton