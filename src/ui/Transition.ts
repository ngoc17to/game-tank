class Transition {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public fadeIn(target: Phaser.GameObjects.Container, duration: number = 200): void {
        target.setVisible(true);
        target.setActive(true);
        target.setInteractive();
        target.setAlpha(0);
        target.setScale(0.5);
        this.scene.tweens.add({
            targets: target,
            alpha: 1,
            scale: 1,
            duration: duration,
            ease: 'Quint.easeIn'
        });
    }

    public fadeOut(target: Phaser.GameObjects.Container, duration: number = 300): void {
        target.setAlpha(1);
        target.setScale(1);
        this.scene.tweens.add({
            targets: target,
            alpha: 0,
            scale: 0.5,
            duration: duration,
            ease: 'Quint.easeIn',
            onComplete: () => {
                target.setVisible(false);
                target.setActive(false);
            }
        });
    }
}

export default Transition