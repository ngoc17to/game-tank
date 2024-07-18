import { Bullet } from './bullet';
import { ISpriteConstructor } from '../types/sprite';
import { GameScene } from '../scenes/GameScene';

export class Player extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;

  private currentScene: GameScene
  // variables
  private health: number;
  private lastShoot: number;
  private speed: number;
  private initialPosition: { x: number, y: number };
  private acceleration: number = 1000;
  private deceleration: number = 1000;
  private maxSpeed: number = 400;
  private lastMouseShoot: number = 0;
  // children
  private barrel: Phaser.GameObjects.Sprite;
  private lifeBar: Phaser.GameObjects.Graphics;

  // game objects
  private bullets: Phaser.GameObjects.Group;

  // input
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveUp: Phaser.Input.Keyboard.Key;
  private moveDown: Phaser.Input.Keyboard.Key;
  private moveLeft: Phaser.Input.Keyboard.Key;
  private moveRight: Phaser.Input.Keyboard.Key;
  private shootingKey: Phaser.Input.Keyboard.Key;

  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets;
  }

  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
    this.currentScene = aParams.scene;
    this.initialPosition = { x: aParams.x, y: aParams.y };
    this.setState('alive')
    this.initImage();
    this.scene.add.existing(this);
  }

  private initImage() {
    // variables
    this.health = 1;
    this.lastShoot = 0;
    this.speed = 200;

    // image
    this.setOrigin(0.5, 0.5);
    this.setDepth(0);
    this.angle = 180;

    this.barrel = this.scene.add.sprite(this.x, this.y, 'barrelBlue');
    this.barrel.setOrigin(0.5, 1);
    this.barrel.setDepth(1);
    this.barrel.angle = 180;

    this.lifeBar = this.scene.add.graphics();
    this.redrawLifebar();

    // game objects
    this.bullets = this.scene.add.group({
      /*classType: Bullet,*/
      active: true,
      maxSize: 10,
      runChildUpdate: true
    });

    // input
    this.cursors = this.scene.input.keyboard!.createCursorKeys();
    this.moveUp = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.moveDown = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.moveLeft = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.moveRight = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.shootingKey = this.scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // physics
    this.scene.physics.world.enable(this);
  }

  update(): void {
    if (this.active) {
      this.barrel.x = this.x;
      this.barrel.y = this.y;
      this.lifeBar.x = this.x;
      this.lifeBar.y = this.y;
      this.handleInput();
      this.handleShooting();
      this.handleBarrelRotation();

    }
  }
  private handleBarrelRotation(): void {
    const pointer = this.scene.input.activePointer;
    const angle = Phaser.Math.Angle.Between(
        this.x, 
        this.y, 
        pointer.x + this.scene.cameras.main.scrollX, 
        pointer.y + this.scene.cameras.main.scrollY
    );
    this.barrel.rotation = angle + Math.PI/2;
}
  private handleInput() {
    let targetVelocityX = 0;
    let targetVelocityY = 0;

    if (this.moveUp.isDown || this.cursors.up.isDown) targetVelocityY = -this.maxSpeed;
    else if (this.moveDown.isDown || this.cursors.down.isDown) targetVelocityY = this.maxSpeed;

    if (this.moveLeft.isDown || this.cursors.left.isDown) targetVelocityX = -this.maxSpeed;
    else if (this.moveRight.isDown || this.cursors.right.isDown) targetVelocityX = this.maxSpeed;

    if (targetVelocityX !== 0 && targetVelocityY !== 0) {
      const factor = this.maxSpeed / Math.sqrt(targetVelocityX * targetVelocityX + targetVelocityY * targetVelocityY);
      targetVelocityX *= factor;
      targetVelocityY *= factor;
    }

    const dt = this.scene.sys.game.loop.delta / 1000;
    
    this.body.velocity.x = Phaser.Math.Linear(this.body.velocity.x, targetVelocityX, this.acceleration * dt / this.maxSpeed);
    this.body.velocity.y = Phaser.Math.Linear(this.body.velocity.y, targetVelocityY, this.acceleration * dt / this.maxSpeed);

    // Xoay thân tank theo hướng di chuyển
    if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
        const angle = Math.atan2(this.body.velocity.y, this.body.velocity.x);
        this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, angle + Math.PI/2, 0.1);
    }
  }

  private handleShooting(): void {
    const currentTime = this.scene.time.now;
    const shootDelay = 80;
    if(this.currentScene.stateMachine.getState() === 'play'){
      if (this.shootingKey.isDown || this.scene.input.activePointer.isDown) {
          if (currentTime > this.lastShoot) {
              this.shoot();
              this.lastShoot = currentTime + shootDelay;
          }
      }
    }
}

private shoot(): void {
    this.scene.cameras.main.shake(20, 0.005);
    this.scene.tweens.add({
        targets: this,
        props: { alpha: 0.8 },
        delay: 0,
        duration: 5,
        ease: 'Power1',
        easeParams: null,
        hold: 0,
        repeat: 0,
        repeatDelay: 0,
        yoyo: true,
        paused: false
    });

    if (this.bullets.getLength() < 10) {
        this.bullets.add(
            new Bullet({
                scene: this.scene,
                rotation: this.barrel.rotation,
                x: this.barrel.x,
                y: this.barrel.y,
                texture: 'bulletBlue'
            })
        );
        if(this.currentScene.isSoundOn) this.currentScene.shootSound.play();
    }
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
      this.setState('dead')
    }
  }

  public reset(): void {
    this.x = this.initialPosition.x;
    this.y = this.initialPosition.y;
    this.health = 1;
    this.lastShoot = 0;
    this.angle = 180;
    this.barrel.angle = 180;
    this.barrel.x = this.x;
    this.barrel.y = this.y;
    this.lifeBar.x = this.x;
    this.lifeBar.y = this.y;
    this.redrawLifebar();
    this.active = true;
    this.visible = true
    this.setState('alive')
  }

  public pause(): void {
    this.body.setVelocity(0, 0);
    this.body.moves = false;
    this.active = false;
  }

  public resume(): void {
    this.active = true;
    this.body.moves = true;
  }

  public hit(): void {
    this.explodeTank()
    this.body.setVelocity(0, 0);
    this.visible = false
  }
}
