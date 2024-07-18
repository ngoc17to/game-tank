import { GameScene } from '../scenes/GameScene';
import { ISpriteConstructor } from '../types/sprite';
import { Bullet } from './bullet';

export class Enemy extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;

  // variables
  private health: number;
  private lastShoot: number;
  private speed: number;
  private currentScene: GameScene
  private initialPosition: { x: number, y: number };
  private moveTweens: Phaser.Tweens.BaseTween
  // children
  private barrel: Phaser.GameObjects.Sprite;
  private lifeBar: Phaser.GameObjects.Graphics;

  // game objects
  private bullets: Phaser.GameObjects.Group;

  public getBarrel(): Phaser.GameObjects.Sprite {
    return this.barrel;
  }

  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets;
  }

  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
    this.currentScene = aParams.scene;
    this.initialPosition = { x: aParams.x, y: aParams.y };
    this.setState('alive')
    this.initContainer();
    this.scene.add.existing(this);
  }

  private initContainer() {
    // variables
    this.health = 1;
    this.lastShoot = 0;
    this.speed = 100;

    // image
    this.setDepth(0);

    this.barrel = this.scene.add.sprite(0, 0, 'barrelRed');
    this.barrel.setOrigin(0.5, 1);
    this.barrel.setDepth(1);

    this.lifeBar = this.scene.add.graphics();
    this.redrawLifebar();

    // game objects
    this.bullets = this.scene.add.group({
      /*classType: Bullet,*/
      active: true,
      maxSize: 10,
      runChildUpdate: true
    });

    // tweens
    this.moveTweens = this.scene.tweens.add({
      targets: this,
      props: { y: this.y - 200 },
      delay: 0,
      duration: 2000,
      ease: 'Linear',
      easeParams: null,
      hold: 0,
      repeat: -1,
      repeatDelay: 0,
      yoyo: true
    });

    // physics
    this.scene.physics.world.enable(this);
  }

  update(): void {
    if (this.active) {
      this.barrel.x = this.x;
      this.barrel.y = this.y;
      this.lifeBar.x = this.x;
      this.lifeBar.y = this.y;
      // this.handleShooting();
    } 
  }

  private showFloatingScore(): void {
    const floatingText = this.scene.add.text(this.x, this.y, `+100`, {font: '32px Arial'});

    this.scene.tweens.add({
        targets: floatingText,
        y: this.y - 50,
        alpha: 0,
        duration: 2000,
        ease: 'Power2',
        onComplete: () => {
            floatingText.destroy();
        }
    });
  }

  private explodeTank(): void {
    const explosion = this.currentScene.add.sprite(this.x, this.y, 'explosionTank');
    explosion.setScale(4);
    explosion.play('explodeTank');
    explosion.once('animationcomplete', () => {
        explosion.destroy();
    });

    if(this.currentScene.isSoundOn) this.currentScene.hitSound.play()
  }

  private handleShooting(): void {
    if (this.scene.time.now > this.lastShoot) {
      if (this.bullets.getLength() < 10) {
        this.bullets.add(
          new Bullet({
            scene: this.scene,
            rotation: this.barrel.rotation,
            x: this.barrel.x,
            y: this.barrel.y,
            texture: 'bulletRed'
          })
        );

        this.lastShoot = this.scene.time.now + 400;
      }
    }
  }

  private redrawLifebar(): void {
    this.lifeBar.clear();
    this.lifeBar.fillStyle(0xe66a28, 1);
    this.lifeBar.fillRect(
      -this.width / 2,
      this.height / 2,
      this.width * this.health,
      15
    );
    this.lifeBar.lineStyle(2, 0xffffff);
    this.lifeBar.strokeRect(-this.width / 2, this.height / 2, this.width, 15);
    this.lifeBar.setDepth(1);
  }

  public updateHealth(): void {
    if (this.health > 0) {
      this.health -= 0.05;
      this.redrawLifebar();
    } else {
      this.health = 0;
      this.active = false;
      this.setState('destroy')
    }
  }
  public reset(): void {
    this.x = this.initialPosition.x;
    this.y = this.initialPosition.y;
    this.health = 1;
    this.redrawLifebar();
    this.setState('alive');
    this.lifeBar.visible = true;
    this.active = true;
    this.visible = true;
    if (this.barrel) {
        this.barrel.x = this.x;
        this.barrel.y = this.y;
        this.barrel.visible = true;
    }
    if (this.moveTweens) this.moveTweens.resume();
    this.bullets.clear(true, true);
    this.lastShoot = 0;
    if (this.body) {
        this.body.enable = true;
    }
  }

  public pause(): void {
    this.moveTweens.pause()
    this.active = false;
  }

  public resume(): void {
    this.active = true;
    this.moveTweens.resume()
  }

  public hit(): void {
    this.explodeTank()
    this.currentScene.scoreManager.updateScore(100)
    this.currentScene.scoreText.setText(`Score: ${this.currentScene.scoreManager.getScore()}`)
    this.showFloatingScore()
    this.deactivate()
  }

  public deactivate(): void {
    this.bullets.clear(true, true);
    this.active = false;
    this.visible = false;
    if (this.lifeBar) this.lifeBar.visible = false;
    if (this.barrel) this.barrel.visible = false;
    if (this.body) this.body.enable = false;
    if (this.moveTweens) this.moveTweens.pause();
    this.setState('dead')
  }
}
