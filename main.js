import axios from "axios";

class Player {
  name;
  level;
  base;
  stats;

  constructor(name, level, base, stats = {}) {
    this.name = name;
    this.level = level;
    this.base = base;
    this.stats = stats;
  }

  static async create(name, level, base) {
    try {
      const response = await axios.get(
        "https://eldenring.fanapis.com/api/classes"
      );
      const classData = response.data.data.find((item) => item.name === base);

      if (!classData) {
        throw new Error(`Class "${base}" not found`);
      }

      const stats = {};
      for (const [key, value] of Object.entries(classData.stats)) {
        stats[key] = Number(value);
      }

      return new Player(name, level, base, stats);
    } catch (error) {
      console.error("Failed to create player:", error.message);
      throw error;
    }
  }

  introduce() {
    console.log(`I am ${this.name}, a level ${this.level} ${this.base}`);
  }

  showStats() {
    console.log("Stats:", this.stats);
  }
}

class Playstyle {
  statWeights;

  constructor(statWeights) {
    this.statWeights = statWeights;
  }

  applyStats(player) {
    player.stats.vigor += Math.round(player.level * this.statWeights.vigor);
    player.stats.mind += Math.round(player.level * this.statWeights.mind);
    player.stats.endurance += Math.round(
      player.level * this.statWeights.endurance
    );
    player.stats.strength += Math.round(
      player.level * this.statWeights.strength
    );
    player.stats.dexterity += Math.round(
      player.level * this.statWeights.dexterity
    );
    player.stats.intelligence += Math.round(
      player.level * this.statWeights.intelligence
    );
    player.stats.faith += Math.round(player.level * this.statWeights.faith);
    player.stats.arcane += Math.round(player.level * this.statWeights.arcane);
  }

  async SuggestedWeapons(Scale) {
    let amount = 0;
    try {
      const response = await axios.get(
        "https://eldenring.fanapis.com/api/weapons"
      );
      response.data.data.forEach((item) => {
        item.scalesWith.forEach((scale) => {
          if (
            scale.name.includes(Scale) &&
            (scale.scaling.includes("C") || scale.scaling.includes("B"))
          ) {
            console.log(`A good weapon you can use is the ${item.name}\n
            \nDescription:\n${item.description}
              \n\nAttack:\n${item.attack.map((atk) => atk.name + " " + atk.amount + "\n")}
              \nDefence\n${item.defence.map((defence) => defence.name + " " + defence.amount + "\n")}
              \n\nRequired attributes:\n${item.requiredAttributes.map((req) => req.name + " " + req.amount + "\n")}
              \n\nScales with:\n${item.scalesWith.map((scale) => scale.name + " " + scale.scaling)}\n`);

            amount += 1;
          } else { }
        });
      });
    } finally {
      if (amount === 0) {
        console.log("No weapons found");
      } else {
        return;
      }
    }
  }
}

class StrBuild extends Playstyle {
  constructor() {
    super({
      vigor: 0.349,
      mind: 0.24,
      endurance: 0.127,
      strength: 0.07,
      dexterity: 0.066,
      intelligence: 0.066,
      faith: 0.044,
      arcane: 0.039,
    });
  }

  SuggestedWeapons() {
    super.SuggestedWeapons("Str");
  }
}

class DexBuild extends Playstyle {
  constructor() {
    super({
      vigor: 0.2620087336,
      mind: 0.0873362445,
      endurance: 0.1135371179,
      strength: 0.0786026201,
      dexterity: 0.3493449782,
      intelligence: 0.03930131,
      faith: 0.0349344978,
      arcane: 0.0349344978,
    });
  }

  SuggestedWeapons() {
    super.SuggestedWeapons("Dex");
  }
}

class IntDexBuild extends Playstyle {
  constructor() {
    super({
      vigor: 0.2183406114,
      mind: 0.0873362445,
      endurance: 0.0917030568,
      strength: 0.0524017467,
      dexterity: 0.2183406114,
      intelligence: 0.2620087336,
      faith: 0.0305676856,
      arcane: 0.03930131,
    });
  }

  SuggestedWeapons() {
    super.SuggestedWeapons("Int");
  }
  SuggestedWeapons() {
    super.SuggestedWeapons("Dex");
  }
}

//Death Intelligence build
class DeaIntBuild extends Playstyle {
  constructor() {
    super({
      vigor: 0.1746724891,
      mind: 0.1091703057,
      endurance: 0.0436681223,
      strength: 0.0349344978,
      dexterity: 0.0742358079,
      intelligence: 0.2620087336,
      faith: 0.2620087336,
      arcane: 0.03930131,
    });
  }

  SuggestedWeapons() {
    super.SuggestedWeapons("Int");
  }
}

//Frost intelligence build
class FroIntBuild extends Playstyle {
  constructor() {
    super({
      vigor: 0.2401746725,
      mind: 0.1091703057,
      endurance: 0.1091703057,
      strength: 0.0698689956,
      dexterity: 0.0524017467,
      intelligence: 0.3493449782,
      faith: 0.0305676856,
      arcane: 0.03930131,
    });
  }

  SuggestedWeapons() {
    super.SuggestedWeapons("Int");
  }
}

async function init() {
  try {
    const player = await Player.create("Li Yiu", 20, "Hero");
    player.introduce();
    const dexBuild = new DexBuild();
    dexBuild.applyStats(player);
    player.showStats();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

init();

const strBuild = new StrBuild();
const dexBuild = new DexBuild();
strBuild.SuggestedWeapons();
