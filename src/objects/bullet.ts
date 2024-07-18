import { GameScene } from "../scenes/GameScene";
import { IBulletConstructor } from "../types/bullet";

export class Bullet extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;

    private bulletSpeed: number;
    private currentScene: GameScene
    constructor(aParams: IBulletConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture);
        this.currentScene = aParams.scene;
        this.rotation = aParams.rotation;
        this.initSprite();
        this.scene.add.existing(this);
    }

    private initSprite(): void {
        // variables
        this.bulletSpeed = 1000;

        // image
        this.setOrigin(0.5, 0.5);
        this.setDepth(2);

        // physics
        this.scene.physics.world.enable(this);
        this.scene.physics.velocityFromRotation(
          this.rotation - Math.PI / 2,
          this.bulletSpeed,
          this.body.velocity
        );
    }

    public explodeBullet(): void {
        const explosion = this.currentScene.add.sprite(this.x, this.y, 'explosionBullet');
        explosion.setScale(1);
        explosion.play('explodeBullet');
        explosion.once('animationcomplete', () => {
            explosion.destroy();
        });
    
    }
}
