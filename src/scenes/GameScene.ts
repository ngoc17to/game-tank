import { Player } from '../objects/player'
import { Enemy } from '../objects/enemy'
import { Obstacle } from '../objects/obstacles/obstacle'
import { Bullet } from '../objects/bullet'
import PauseMenu from '../ui/PauseMenu'
import GameOverScreen from '../ui/GameOverScreen'
import Transition from '../ui/Transition'
import StateMachine from '../states/StateMachine'
import PlayState from '../states/PlayState'
import PauseState from '../states/PauseState'
import OverState from '../states/OverState'
import StartState from '../states/StartState'
import Button from '../ui/Button'
import ScoreManager from '../manager.ts/ScoreManager'

export class GameScene extends Phaser.Scene {
    private map: Phaser.Tilemaps.Tilemap
    private tileset: Phaser.Tilemaps.Tileset
    private layer: Phaser.Tilemaps.TilemapLayer

    private player: Player
    private enemies: Phaser.GameObjects.Group
    private obstacles: Phaser.GameObjects.Group

    public pauseMenu: PauseMenu
    public gameOverScreen: GameOverScreen
    public transition: Transition
    public pauseButton: Button

    public scoreText: Phaser.GameObjects.Text
    public scoreManager: ScoreManager

    public stateMachine: StateMachine

    public isSoundOn: boolean
    public shootSound: Phaser.Sound.BaseSound
    public hitSound: Phaser.Sound.BaseSound
    public clickSound: Phaser.Sound.BaseSound

    public getPlayer(): Player {
        return this.player
    }
    public getEnemies(): Phaser.GameObjects.Group {
        return this.enemies
    }
    public getObstacles(): Phaser.GameObjects.Group {
        return this.obstacles
    }
    constructor() {
        super({
            key: 'GameScene'
        })
    }

    create(): void {
        this.isSoundOn = true
        this.shootSound = this.sound.add('shoot', {volume: 0.3})
        this.hitSound = this.sound.add('hit')
        this.clickSound = this.sound.add('click')
        this.anims.create({
            key: 'explodeTank',
            frames: this.anims.generateFrameNumbers('explodeTank', { start: 0, end: 5 }),
            frameRate: 20,
            repeat: 0
        });
        this.anims.create({
            key: 'explodeBullet',
            frames: this.anims.generateFrameNumbers('explodeBullet', { start: 0, end: 4 }),
            frameRate: 20,
            repeat: 0
        });
        // create tilemap from tiled JSON
        this.map = this.make.tilemap({ key: 'levelMap' })

        this.tileset = this.map.addTilesetImage('tiles')!
        this.layer = this.map.createLayer('tileLayer', this.tileset, 0, 0)!
        this.layer.setCollisionByProperty({ collide: true })

        this.obstacles = this.add.group({
            classType: Obstacle,
            runChildUpdate: true
        })

        this.enemies = this.add.group({
            classType: Enemy
        })
        this.convertObjects()

        // collider layer and obstacles
        this.physics.add.collider(this.player, this.layer)
        this.physics.add.collider(this.player, this.obstacles)

        // collider for bullets
        this.physics.add.collider(
            this.player.getBullets(),
            this.layer,
            this.bulletHitLayer as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        )

        this.physics.add.collider(
            this.player.getBullets(),
            this.obstacles,
            this.bulletHitObstacles as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        )

        this.enemies.getChildren().forEach((enemyObject: Phaser.GameObjects.GameObject) => {
            const enemy = enemyObject as Enemy

            this.physics.add.overlap(
                this.player.getBullets(),
                enemy,
                this.playerBulletHitEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
                undefined,
                this
            )
            this.physics.add.overlap(
                enemy.getBullets(),
                this.player,
                this.enemyBulletHitPlayer as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
                undefined
            )

            this.physics.add.collider(
                enemy.getBullets(),
                this.obstacles,
                this.bulletHitObstacles as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
                undefined
            )
            this.physics.add.collider(
                enemy.getBullets(),
                this.layer,
                this.bulletHitLayer as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
                undefined
            )
        }, this)

        this.cameras.main.startFollow(this.player)
        const { width, height } = this.cameras.main
        this.pauseButton = new Button(
            this,
            width - 80,
            60,
            ['pause', 'pause_hover'],
            () => {this.stateMachine.transition('pause')}
        )
        this.scoreManager = new ScoreManager(this)
        this.scoreText = this.add.text(
            10, 
            10, 
            `Score: ${this.scoreManager.getScore()}`, 
            { font: '48px Arial' }
        );
        this.scoreText.setScrollFactor(0)
        this.pauseMenu = new PauseMenu(this, width / 2, height / 2)
        this.pauseMenu.setVisible(false)
        this.gameOverScreen = new GameOverScreen(this, width / 2, height / 2)
        this.gameOverScreen.setVisible(false)
        this.transition = new Transition(this)
        this.stateMachine = new StateMachine('play', {
            start: new StartState(this),
            play: new PlayState(this),
            pause: new PauseState(this),
            over: new OverState(this),
        })
    }

    update(time: number, delta: number): void {
        this.stateMachine.update(time, delta)
    }

    public convertObjects(): void {
        // find the object layer in the tilemap named 'objects'
        const objects = this.map.getObjectLayer('objects')?.objects as any[]

        objects.forEach((object) => {
            if (object.type === 'player') {
                this.player = new Player({
                    scene: this,
                    x: object.x,
                    y: object.y,
                    texture: 'tankBlue'
                })
            } else if (object.type === 'enemy') {
                let enemy = new Enemy({
                    scene: this,
                    x: object.x,
                    y: object.y,
                    texture: 'tankRed'
                })

                this.enemies.add(enemy)
            } else {
                let obstacle = new Obstacle({
                    scene: this,
                    x: object.x,
                    y: object.y - 40,
                    texture: object.type
                })

                this.obstacles.add(obstacle)
            }
        })
    }

    public resetEnemies(): void {
        console.log('reset', this.enemies)
        const objects = this.map.getObjectLayer('objects')?.objects as any[]

        objects.forEach((object) => {
            if (object.type === 'enemy') {
                let enemy = new Enemy({
                    scene: this,
                    x: object.x,
                    y: object.y,
                    texture: 'tankRed'
                })

                this.enemies.add(enemy)
            }
        })
        console.log('reset', this.enemies)
    }

    private bulletHitLayer(bullet: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile): void {
        if (bullet instanceof Bullet) {
            bullet.destroy()
            bullet.explodeBullet()
        }
    }

    private bulletHitObstacles(bullet: Bullet, obstacle: Obstacle): void {
        bullet.destroy()
        bullet.explodeBullet()
    }

    private enemyBulletHitPlayer(bullet: Bullet, player: Player): void {
        bullet.destroy()
        bullet.explodeBullet()
        player.updateHealth()
    }

    private playerBulletHitEnemy(bullet: Bullet, enemy: Enemy): void {
        bullet.destroy()
        bullet.explodeBullet()
        enemy.updateHealth()
    }
}
