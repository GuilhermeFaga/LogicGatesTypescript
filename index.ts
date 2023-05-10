

interface PinInterface {
  value: number;
  connections: PinInterface[];
}

class InputPin implements PinInterface {
  value: number;
  connections: OutputPin[];

  constructor() {
    this.value = 0;
    this.connections = [];
  }

  connect(output: OutputPin) {
    this.connections.push(output);
    output.connections.push(this);
  }

  disconnect(output: OutputPin) {
    this.connections = this.connections.filter((conn) => conn !== output);
    output.connections = output.connections.filter((input) => input !== this);
  }

  update() {
    this.value = 0;
    for (const output of this.connections) {
      if (output.value) {
        this.value = 1;
        break;
      }
    }
  }
}

class OutputPin implements PinInterface {
  value: number;
  connections: InputPin[];

  constructor() {
    this.value = 0;
    this.connections = [];
  }

  connect(input: InputPin) {
    this.connections.push(input);
    input.connections.push(this);
  }

  disconnect(input: InputPin) {
    this.connections = this.connections.filter((conn) => conn !== input);
    input.connections = input.connections.filter((output) => output !== this);
  }
}

class Chip {
  inputs: InputPin[];
  output: OutputPin;

  constructor(nOfInputs: number) {
    this.inputs = [];
    for (let i = 0; i < nOfInputs; i++) {
      this.inputs.push(new InputPin());
    }
    this.output = new OutputPin();
  }

  connectInput(inputIndex: number, output: OutputPin) {
    this.inputs[inputIndex].connect(output);
    this.update();
  }

  connectOutput(input: InputPin) {
    this.output.connect(input);
    this.update();
  }

  disconnect(inputIndex: number, output: OutputPin) {
    this.inputs[inputIndex].disconnect(output);
    this.update();
  }

  update() {
    for (const input of this.inputs) {
      input.update();
    }
  }

  getOutputValue() {
    this.update();
    return this.output.value;
  }
}

class AndGate extends Chip {
  constructor() {
    super(2);
  }

  update() {
    super.update();
    this.output.value = this.inputs[0].value && this.inputs[1].value ? 1 : 0;
  }
}

class NotGate extends Chip {
  constructor() {
    super(1);
  }

  update() {
    super.update();
    this.output.value = this.inputs[0].value ? 0 : 1;
  }
}

class SystemInput extends OutputPin { }
class SystemOutput extends InputPin { }

class System {
  chips: Chip[];
  systemInputs: SystemInput[];
  systemOutput: SystemOutput;

  constructor(nOfSystemInputs: number) {
    this.chips = [];
    this.systemInputs = [];
    for (let i = 0; i < nOfSystemInputs; i++) {
      this.systemInputs.push(new SystemInput());
    }
    this.systemOutput = new SystemOutput();
  }

  setInputValue(inputIndex: number, value: number) {
    this.systemInputs[inputIndex].value = value;
    this.update();
  }

  addChip(chip: Chip) {
    this.chips.push(chip);
  }

  update() {
    for (const chip of this.chips) {
      chip.update();
    }
    this.systemOutput.update();
  }

  getValue() {
    this.update();
    return this.systemOutput.value;
  }

  convertSystemToChip() {
    const chip = new Chip(this.systemInputs.length);
    chip.update = () => {
      for (const input of chip.inputs) {
        input.update();
      }
      for (let i = 0; i < this.systemInputs.length; i++) {
        this.systemInputs[i].value = chip.inputs[i].value;
      }
      this.update();
      chip.output.value = this.systemOutput.value;
    }
    return chip;
  }
}


/* Examples */

console.log("---------OR GATE---------");

const system = new System(2);

system.systemInputs[0].connect(system.systemOutput);
system.systemInputs[1].connect(system.systemOutput);

system.setInputValue(0, 0);
system.setInputValue(1, 1);

console.log(system)

console.log("System output: ", system.getValue());

const orGate = system.convertSystemToChip();


console.log("---------NOR GATE---------");

// Create a new system
const system2 = new System(2);

// Add the chips to the system
system2.addChip(orGate);

const notGate = new NotGate();
system2.addChip(notGate);

// Connect the system inputs to the chips
system2.systemInputs[0].connect(orGate.inputs[0]);
system2.systemInputs[1].connect(orGate.inputs[1]);

// Connect the chips to each other
orGate.output.connect(notGate.inputs[0]);

// Connect the chips to the system output
notGate.output.connect(system2.systemOutput);

system2.setInputValue(0, 0);
system2.setInputValue(1, 0);

console.log(system2);
console.log(orGate);
console.log(notGate);

console.log("System output: ", system2.getValue());
