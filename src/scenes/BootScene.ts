export class BootScene extends Phaser.Scene {
    private loadingBar: Phaser.GameObjects.Graphics;
    private progressBar: Phaser.GameObjects.Graphics;

    constructor() {
        super({
            key: 'BootScene'
        });
    }

    preload(): void {
        // set the background, create the loading and progress bar
        this.cameras.main.setBackgroundColor(0x000000);
        this.createLoadingGraphics();

        // pass value to change the loading bar fill
        this.load.on(
            'progress',
            (value: number) => {
                this.progressBar.clear();
                this.progressBar.fillStyle(0x88e453, 1);
                this.progressBar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                );
            }
        );

        // delete bar graphics, when loading complete
        this.load.on(
            'complete',
            () => {
                this.progressBar.destroy();
                this.loadingBar.destroy();

            }
        );

        // load our package
        this.load.pack('preload', './assets/pack.json', 'preload');
        this.load.pack('button', './assets/images/buttonPack.json', 'button');
        this.load.image('pauseBtn', './assets/images/pauseBtn.png');
        this.load.image('playBtn', './assets/images/Default.png');
        this.load.image('replayBtn', './assets/images/replayBtn.png');
        this.load.image('musicOnBtn', './assets/images/musicOnBtn.png');
        this.load.image('musicOffBtn', './assets/images/musicOffBtn.png');
        this.load.image('BG', './assets/images/whiteBG.png');
        this.load.bitmapFont('gameFont', 'assets/font/font.png', 'assets/font/font.fnt')
        this.load.audio('shoot', 'assets/sounds/heavy_machinegun.ogg');
        this.load.audio('hit', 'assets/sounds/explodemini.wav');
        this.load.audio('click', 'assets/sounds/click_sound.wav');
        this.load.spritesheet('explodeTank', 'assets/effects/explosion1.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet('explodeBullet', 'assets/effects/explosion2.png', {
            frameWidth: 64,
            frameHeight: 64
        });
                    
    }

    update(): void {
        this.scene.start('MenuScene');
    }

    private createLoadingGraphics(): void {
        this.loadingBar = this.add.graphics();
        this.loadingBar.fillStyle(0xffffff, 1);
        this.loadingBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}