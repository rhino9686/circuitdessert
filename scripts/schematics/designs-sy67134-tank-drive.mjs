// Schematic for the "two-motor tank drive with two SY67134 H-bridges" recipe: a hypothetical design of our own, not a datasheet figure.
// Each channel is the SY67134 typical application (see designs-sy67134.mjs) with values chosen in the recipe. The motor supply and the
// reference voltage are drawn as net flags only: the recipe leaves their source open.
import { Sheet, refMarkup } from './lib.mjs';

export function sy67134TankDrive({ id, part, v = {} }) {
  const val = { vm: 'VM', cbulk: '100 µF', cvm: '10 µF', cref: '0.1 µF', rsense: '50 mΩ', ...v };
  const CH = 340; // vertical distance between the two channels
  const s = new Sheet(760, 90 + CH + 330, {
    top: 60,
    id,
    title: `${part} two-motor drive`,
    desc:
      `Two ${part} H-bridge motor drivers, one for each motor of a tracked robot. Each driver has its VM pin on the shared motor supply net VM, with a ${val.cbulk} electrolytic capacitor CBULK and a ${val.cvm} ceramic capacitor CVM from VM to ground. ` +
      `The VREF pins of both drivers go to one shared reference voltage net VREF, and each has its own ${val.cref} capacitor CREF to ground. IN1 and IN2 of each driver come from a controller (nets IN1L and IN2L for the left driver U1, IN1R and IN2R for the right driver U2). ` +
      `A brushed DC motor connects between OUT1 and OUT2 of each driver (M1 on the left, M2 on the right). ISEN of each driver goes to ground through a ${val.rsense} current-sense resistor (RSENSE1 and RSENSE2). The supply and the reference voltage are not specified.`,
  });

  const ic = { x: 300, w: 170, h: 250 };
  const channels = [
    { n: 1, oy: 0, side: 'L', who: 'Left motor' },
    { n: 2, oy: CH, side: 'R', who: 'Right motor' },
  ];

  for (const { n, oy, side, who } of channels) {
    const Y = (y) => y + oy;
    const icy = Y(90);
    const lx = ic.x - 12;
    const rx = ic.x + ic.w + 12;
    const yVM = Y(120), yGND = Y(170), yIN1 = Y(225), yIN2 = Y(260), yVREF = Y(310);
    const yOUT1 = Y(120), yOUT2 = Y(260), yISEN = Y(310);

    s.ic(ic.x, icy, ic.w, ic.h, {
      left: [{ name: 'VM', y: yVM }, { name: 'GND', y: yGND }, { name: 'IN1', y: yIN1 }, { name: 'IN2', y: yIN2 }, { name: 'VREF', y: yVREF }],
      right: [{ name: 'OUT1', y: yOUT1 }, { name: 'OUT2', y: yOUT2 }, { name: 'ISEN', y: yISEN }],
    }, { title: part, subtitle: `U${n}, ${who.toLowerCase()}` });

    // ---- supply: VM flag, bulk and ceramic capacitors from VM to the GND pin, GND to ground
    const cbX = 150, cvX = 220;
    s.port(50, yVM, val.vm, 'in');
    s.wire([50, yVM], [lx, yVM]);
    s.dot(cbX, yVM).capacitor(cbX, yVM, cbX, yGND, { polarized: true }).label(cbX, Y(156), `CBULK${n}`, val.cbulk, 'left');
    s.dot(cvX, yVM).capacitor(cvX, yVM, cvX, yGND).label(cvX, Y(145), `CVM${n}`, val.cvm, 'right');
    s.wire([cbX, yGND], [lx, yGND]).dot(cvX, yGND).ground(cbX, yGND);

    // ---- logic inputs from the controller
    for (const [name, y] of [[`IN1${side}`, yIN1], [`IN2${side}`, yIN2]]) s.port(50, y, name, 'in').wire([50, y], [lx, y]);

    // ---- reference: shared VREF net, CREF to ground
    const crX = 190;
    s.port(50, yVREF, 'VREF', 'in');
    s.wire([50, yVREF], [lx, yVREF]).dot(crX, yVREF).capacitor(crX, yVREF, crX, Y(360)).ground(crX, Y(360)).label(crX, Y(336), `CREF${n}`, val.cref, 'right');

    // ---- motor between OUT1 and OUT2
    const mx = 600, my = Y(190), mr = 30;
    s.wire([rx, yOUT1], [mx, yOUT1], [mx, my - mr]);
    s.wire([rx, yOUT2], [mx, yOUT2], [mx, my + mr]);
    s.add(`<circle class="sch-w" cx="${mx}" cy="${my}" r="${mr}"/>`);
    s.text(mx, my + 5, `M${n}`, { cls: 'sch-ictitle', anchor: 'middle' });
    s.text(mx, my + mr + 18, who, { cls: 'sch-val', anchor: 'middle' });

    // ---- current sense: ISEN through RSENSE to ground
    const rsX = 540;
    s.wire([rx, yISEN], [rsX, yISEN]).resistor(rsX, yISEN, rsX, Y(370)).ground(rsX, Y(370));
    s.text(rsX + 16, Y(336), refMarkup(`RSENSE${n}`), { cls: 'sch-ref', anchor: 'start', raw: true }).text(rsX + 16, Y(349), val.rsense, { cls: 'sch-val', anchor: 'start' });
  }
  return s;
}
