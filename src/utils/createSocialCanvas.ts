const fire = require('../images/social/fire.jpg');
const volcano = require('../images/social/volcano.jpg');
const ice = require('../images/social/ice.jpg');
const desert = require('../images/social/desert.jpg');
const network = require('../images/social/network.jpg');
const mountain = require('../images/social/mountain.jpg');
const moon = require('../images/social/moon.jpg');

const tyrannosaurus = require('../images/mascots/tyrannosaurus.png');
const astronaut_on_moon = require('../images/mascots/astronaut_on_moon.png');
const rainbow_unicorn = require('../images/mascots/rainbow_unicorn.png');
const koalas = require('../images/mascots/koalas.png');
const astronaut_dabbing = require('../images/mascots/astronaut_dabbing.png');
const astronaut_on_rocket = require('../images/mascots/astronaut_on_rocket.png');
const astronaut_to_the_moon = require('../images/mascots/astronaut_to_the_moon.png');
const baby = require('../images/mascots/baby.png');
const cat_in_donut = require('../images/mascots/cat_in_donut.png');
const chameleon = require('../images/mascots/chameleon.png');
const panda_with_bamboo = require('../images/mascots/panda_with_bamboo.png');
const shark = require('../images/mascots/shark.png');
const sloth_doing_yoga = require('../images/mascots/sloth_doing_yoga.png');

export const images: { [key: string]: string } = {
  fire,
  volcano,
  ice,
  desert,
  network,
  mountain,
  moon,
  default: fire,
};

export const mascots: { [key: string]: string } = {
  tyrannosaurus,
  rainbow_unicorn,
  astronaut_on_moon,
  astronaut_dabbing,
  astronaut_on_rocket,
  astronaut_to_the_moon,
  baby,
  cat_in_donut,
  chameleon,
  panda_with_bamboo,
  shark,
  sloth_doing_yoga,
  koalas,
  default: tyrannosaurus,
};

const values: { [key: string]: { alpha: number; fillStyle: string; fontColor: string } } = {
  desert: { alpha: 0.1, fillStyle: '#fff', fontColor: '#000022' },
  fire: { alpha: 0.5, fillStyle: '#222', fontColor: '#ffffff' },
  volcano: { alpha: 0.5, fillStyle: '#222', fontColor: '#ffffff' },
  ice: { alpha: 0.4, fillStyle: '#000', fontColor: '#ffffff' },
  mountain: { alpha: 0.6, fillStyle: '#fff', fontColor: '#111111' },
  network: { alpha: 0.6, fillStyle: '#223', fontColor: '#ffffff' },
  moon: { alpha: 0.6, fillStyle: '#223', fontColor: '#ffffff' },
};
export const createSocialCanvas = (
  fungible: boolean,
  purseId: string,
  contractId: string,
  quantity: number,
  style: string,
  mascot: string
) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', '1000px');
    canvas.setAttribute('height', '500px');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    const background = new Image();
    background.src = images[style] || images.default;

    background.onload = () => {
      context.drawImage(background, 0, 0);

      context.globalAlpha = values[style].alpha;
      context.fillStyle = values[style].fillStyle;
      context.fillRect(0, 0, 1000, 500);
      context.globalAlpha = 1;

      context.font = '600 75px fira';
      context.fillStyle = values[style].fontColor;
      if (fungible) {
        context.fillText(`I own ${quantity} tokens`, 40, 160);
      } else {
        context.fillText(`I own NFT "${purseId}"`, 40, 160);
      }

      context.font = '600 30px fira';
      context.fillText(`in contract "${contractId}"`, 40, 200);

      context.font = '600 30px fira';
      context.fillText(`d/dappy | dappy.tech`, 685, 480);
      if (mascot === 'none') {
        resolve(canvas.toDataURL('image/png'));
      } else {
        const mascotImg = new Image();
        mascotImg.src = mascots[mascot] || mascots.default;

        mascotImg.onload = () => {
          context.drawImage(mascotImg, 0, 200, 300, 300);
          resolve(canvas.toDataURL('image/png'));
        };
      }
    };
  });
};
