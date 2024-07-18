import { ISpriteConstructor } from "../../types/sprite";

export class Obstacle extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;

  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);

    this.initSprite();
    this.scene.add.existing(this);
  }

  private initSprite(): void {
    // image
    this.setOrigin(0, 0);

    // physics
    this.scene.physics.world.enable(this);
    this.body.setImmovable(true);
  }

  update(): void {}
}
