/// <reference types="../CTAutocomplete" />

import Dungeon from "../BloomCore/dungeons/Dungeon";
import { registerWhen } from "../BloomCore/utils/Utils";
import PogObject from "../PogData";

const data = new PogObject("hollow", {
  "x": 100,
  "y": 100
}, "data.json");

const moveGUI = new Gui();
const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction");
let ticks = 400;
let numStacks = 0;

register("packetReceived", () => {
  ticks++;
}).setFilteredClass(S32PacketConfirmTransaction);

register("chat", () => {
  if(ticks > 400) {
    numStacks = 0;
  }
  if(numStacks < 3) {
    numStacks++;
  }

  ticks = 0;
}).setCriteria("Casting Spell: Raging Wind!");

registerWhen(register("renderOverlay", () => {
  Renderer.drawStringWithShadow(`${numStacks}: ${Math.round((400 - ticks)/20)}`, data.x, data.y);
}), () => (moveGUI.isOpen() || (Dungeon.inDungeon && ticks < 400)));

register("dragged", (dx, dy, x, y, b) => {
  if(!moveGUI.isOpen()) {
    return;
  }

  data.x = x;
  data.y = y;
  data.save();
});

register("command", () => {
  moveGUI.open();
}).setName("hollow");
