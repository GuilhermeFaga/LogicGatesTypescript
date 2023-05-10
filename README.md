# Logic Gates in TypeScript

The provided code is a simulation of logic gates implemented in TypeScript. The logic gates are represented by classes such as `AndGate` and `NotGate`, which are derived from a base class called `Chip`. The `Chip` class represents a generic logic gate with input pins (`InputPin` instances) and an output pin (`OutputPin` instance).

The `InputPin` class implements the `PinInterface` interface, which defines the properties and methods for a pin. It has a `value` property representing the current value of the pin (0 or 1), and an array `connections` to store the connected output pins. The `InputPin` class also provides methods to connect and disconnect pins, as well as update its value based on the values of connected output pins.

The `OutputPin` class is similar to `InputPin` and also implements the `PinInterface`. It has a value property, an array `connections` to store the connected input pins, and methods to connect and disconnect pins.

The `Chip` class represents a logic gate with multiple input pins and one output pin. It has an array `inputs` to store the input pins and an `output` property to store the output pin. The `Chip` class provides methods to connect and disconnect specific input and output pins, update the values of input pins based on the connected output pins, and retrieve the output value.

The `AndGate` and `NotGate` classes are derived from the Chip class and represent basic types of logic gates. The `AndGate` class has two input pins and performs the logical *AND* operation on their values to determine the output value. The `NotGate` class has one input pin and performs the logical *NOT* operation on its value to determine the output value.

The `SystemInput` and `SystemOutput` classes extend the `OutputPin` and `InputPin` classes, respectively, and are used to represent the input and output pins specific to the overall system.

The `System` class represents the overall system of logic gates. It has arrays `chips` and `systemInputs` to store the chips and system input pins, respectively. It also has a `systemOutput` property to store the system output pin. The `System` class provides methods to set the values of system input pins, add chips to the system, update the values of all chips and the system output pin, and retrieve the system output value.

The `convertSystemToChip` method of the `System` class is used to convert the system into a single chip. It creates a new `Chip` instance with the same number of inputs as the system and overrides the update method to synchronize the values between the system inputs and the chip inputs, update the system, and set the chip output value to the system output value.

Example: OR Gate

To demonstrate the usage of an OR gate, we can connect both system inputs direclty to the system output. The system will then behave like an OR gate:
```js
// Create a new system
const system = new System(2);

system.systemInputs[0].connect(system.systemOutput);
system.systemInputs[1].connect(system.systemOutput);

system.setInputValue(0, 0);
system.setInputValue(1, 1);

console.log(system)
/*
  System {
    chips: [],
    systemInputs: [
      SystemInput { value: 0, connections: [Array] },
      SystemInput { value: 1, connections: [Array] }
    ],
    systemOutput: SystemOutput {
      value: 1,
      connections: [ [SystemInput], [SystemInput] ]
    }
  }
*/

console.log("System output: ", system.getValue());
// System output: 1
```

And then we can use the `convertSystemToChip` method to convert the system into a single chip and use it to create an NOR gate:
```js
// Convert the system into a chip
const orGate = system.convertSystemToChip();

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
/*
  System {
    chips: [
      Chip {
        inputs: [Array],
        output: [OutputPin],
        update: [Function (anonymous)]
      },
      NotGate { inputs: [Array], output: [OutputPin] }
    ],
    systemInputs: [
      SystemInput { value: 0, connections: [Array] },
      SystemInput { value: 0, connections: [Array] }
    ],
    systemOutput: SystemOutput { value: 1, connections: [ [OutputPin] ] }
  }
*/

// The NOR gate only returns 0 when both inputs are 1
console.log("System output: ", system2.getValue());
// System output: 1
```

With this approach, we can create new logic gates and use them in new systems without having to modify the existing code.
