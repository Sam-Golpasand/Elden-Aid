// Importing axios for making HTTP requests
import axios from "axios";

// Player class to represent a player in the game
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

  // Static method to create a new player instance
  static async create(name, level, base) {
    try {
      // Fetching class data from the API
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
      // Handling errors
      console.error("Failed to create player:", error.message);
      throw error;
    }
  }

  // Method to introduce the player
  introduce() {
    console.log(`I am ${this.name}, a level ${this.level} ${this.base}`);
  }

  // Method to display player's stats
  showStats() {
    console.log("Stats:", JSON.stringify(this.stats, null, 2));
  }
}

// Playstyle class to represent different playstyles
class Playstyle {
  statWeights;

  constructor(statWeights) {
    this.statWeights = statWeights;
  }

  applyStats(player) {
    player.stats.vigor += Math.round(player.level * this.statWeights.vigor);
    player.stats.mind += Math.round(player.level * this.statWeights.mind);
    player.stats.endurance += Math.round(player.level * this.statWeights.endurance);
    player.stats.strength += Math.round(player.level * this.statWeights.strength);
    player.stats.dexterity += Math.round(player.level * this.statWeights.dexterity);
    player.stats.intelligence += Math.round(player.level * this.statWeights.intelligence);
    player.stats.faith += Math.round(player.level * this.statWeights.faith);
    player.stats.arcane += Math.round(player.level * this.statWeights.arcane);
  }

  // Method to suggest weapons based on scaling
  async SuggestedWeapons(Scale) {
    let amount = 0;
    try {
      // Fetching weapon data from the API
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
            Description:
            ${item.description}

            Attack:
            ${item.attack.map((atk) => `${atk.name}: ${atk.amount}`).join(", ")}

            Defence:
            ${item.defence.map((def) => `${def.name}: ${def.amount}`).join(", ")}

            Required attributes:
            ${item.requiredAttributes.map((req) => `${req.name}: ${req.amount}`).join(", ")}

            Scales with:
            ${item.scalesWith.map((scale) => `${scale.name}: ${scale.scaling}`).join(", ")}
            `);
            amount += 1;
          }
        });
      });
    } finally {
      // Handling case when no weapons are found
      if (amount === 0) {
        console.log("No weapons found");
      } else {
        return;
      }
    }
  }
}

// Strength build class
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

  // Method to suggest weapons for strength build
  SuggestedWeapons() {
    super.SuggestedWeapons("Str");
  }
}

// Dexterity build class
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

  // Method to suggest weapons for dexterity build
  SuggestedWeapons() {
    super.SuggestedWeapons("Dex");
  }
}

// Intelligence and Dexterity build class
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

  // Method to suggest weapons for intelligence and dexterity build
  SuggestedWeapons() {
    super.SuggestedWeapons("Int");
  }
  SuggestedWeapons() {
    super.SuggestedWeapons("Dex");
  }
}

// Death Intelligence build class
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

  // Method to suggest weapons for death intelligence build
  SuggestedWeapons() {
    super.SuggestedWeapons("Int");
  }
}

// Frost Intelligence build class
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

  // Method to suggest weapons for frost intelligence build
  SuggestedWeapons() {
    super.SuggestedWeapons("Int");
  }
}

// Initialization function to create a player and apply a build
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

// Creating instances of builds and suggesting weapons
const strBuild = new StrBuild();
const dexBuild = new DexBuild();
strBuild.SuggestedWeapons();
dexBuild.SuggestedWeapons();