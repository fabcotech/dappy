import { resolver } from 'beesjs';

const fire = require('../images/social/fire.jpg');
const volcano = require('../images/social/volcano.jpg');
const ice = require('../images/social/ice.jpg');
const desert = require('../images/social/desert.jpg');
const network = require('../images/social/network.jpg');
const mountain = require('../images/social/mountain.jpg');

const values = {
  desert: { alpha: 0.1, fillStyle: '#fff', fontColor: '#000022' },
  fire: { alpha: 0.5, fillStyle: '#222', fontColor: '#ffffff' },
  volcano: { alpha: 0.5, fillStyle: '#222', fontColor: '#ffffff' },
  ice: { alpha: 0.4, fillStyle: '#000', fontColor: '#ffffff' },
  mountain: { alpha: 0.6, fillStyle: '#fff', fontColor: '#111111' },
  network: { alpha: 0.6, fillStyle: '#223', fontColor: '#ffffff' },
};
export const createSocialCanvas = (
  fungible: boolean,
  purseId: string,
  contractId: string,
  quantity: number,
  style: string
) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', '1000px');
    canvas.setAttribute('height', '500px');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    console.log(fire);
    const background = new Image();
    if (style === 'fire') {
      background.src = fire;
    } else if (style === 'mountain') {
      background.src = mountain;
    } else if (style === 'ice') {
      background.src = ice;
    } else if (style === 'volcano') {
      background.src = volcano;
    } else if (style === 'network') {
      background.src = network;
    } else if (style === 'desert') {
      background.src = desert;
    } else {
      background.src = mountain;
    }

    background.onload = () => {
      console.log('oknload');
      context.drawImage(background, 0, 0);

      context.globalAlpha = values[style].alpha;
      context.fillStyle = values[style].fillStyle;
      context.fillRect(0, 0, 1000, 500);
      context.globalAlpha = 1;

      context.font = '600 75px fira';
      context.fillStyle = values[style].fontColor;
      if (fungible) {
        context.fillText(`I own ${quantity} tokens`, 40, 270);
      } else {
        context.fillText(`I own NFT "${purseId}"`, 40, 270);
      }

      context.font = '600 30px fira';
      context.fillText(`in contract ${contractId}`, 40, 305);

      context.font = '600 30px fira';
      context.fillText(`dappy.tech`, 840, 480);
      resolve(canvas.toDataURL('image/png'));
    };
  });
};
