---
title: "Two-motor tank drive with two SY67134 H-bridges: a 1.2 A stall limit per motor (hypothetical setup guide)"
kind: tutorial
category: Power / Motor Driver
summary: "A hypothetical drive stage for a tracked robot: one SY67134 H-bridge per brushed motor on a shared 12 V supply, 20 kHz PWM, and a 1.2 A stall limit set by a 50 mΩ resistor and a 0.6 V reference. Our own design from the datasheet, never built."
abstract: "A tracked robot steers by driving its left and right motors at different speeds, so it needs two H-bridges. This setup guide builds that drive stage from two SY67134 motor drivers, one per brushed DC motor. Each driver is a full H-bridge with its gate drive, charge pump and protection on the die, controlled by two logic inputs. The guide covers what the circuit needs from its motor supply and its reference voltage (both are left open here), how to pick the current-sense resistor and reference level for a stall limit, the capacitors on the supply, how to wire and drive the four logic inputs from a 3.3 V controller, the heat each driver makes, a bring-up checklist and layout notes. The requirements are modelled on the drive stage of a small tracked robot with two 12 V brushed gear motors. The design is hypothetical: nothing here was built or measured, the motor is an assumption, and every number is calculated from the datasheet values on the SY67134 part page."
author: Robert Cecil
draft: true
stats:
  - { value: "12 V", label: "motor supply, source not specified" }
  - { value: "2 × 1.2 A", label: "stall limit, one per motor" }
  - { value: "20 kHz", label: "PWM frequency" }
  - { value: "0.8 W", label: "worst-case loss per driver, at the limit" }
schematic: sy67134-tank-drive-schematic.svg
schematic_caption: "Two SY67134 drivers, one per motor, redrawn from the datasheet's typical application with the values chosen in this guide. The motor supply (VM) and the reference voltage (VREF) are drawn as net flags: each flag on the page is the same net, and what drives it is left open. IN1L and IN2L (left driver) and IN1R and IN2R (right driver) come from the controller. Values are ours: the datasheet's figure has none, apart from the limits on RSENSE (under 100 mΩ) and on CVM (10 µF ceramic) and CREF (at least 0.1 µF) from its pin table."
components:
  - ref: "U1, U2"
    part: "SY67134"
    description: "H-bridge motor driver for one brushed DC motor, SO8E (ordering code SY67134FCC, now sold as SY21634FCC). U1 drives the left motor and U2 the right"
    maker: "Silergy"
  - ref: "M1, M2"
    part: "Brushed DC gear motor, 12 V (assumed)"
    description: "One per track. The current figures in this guide assume 0.8 A running and a 4 Ω winding, which is our assumption; the datasheet names no motor"
  - ref: "CVM1, CVM2"
    part: "10 µF, X5R or better, 25 V"
    description: "VM decoupling to GND, one per driver, as close to the VM and GND pins as possible. The pin table asks for 10 µF ceramic; the 25 V rating is ours (a 25 V part keeps only part of its nominal capacitance at 12 V of bias)"
  - ref: "CBULK1, CBULK2"
    part: "100 µF electrolytic, 25 V"
    description: "Bulk capacitor on VM, one per driver. The datasheet asks for a sufficient one and gives no value; 100 µF is our choice (see Supply capacitors)"
  - ref: "CREF1, CREF2"
    part: "0.1 µF ceramic"
    description: "VREF decoupling to GND, one per driver, close to the VREF pin. The datasheet asks for at least 0.1 µF"
  - ref: "RSENSE1, RSENSE2"
    part: "50 mΩ, 1%, 0.5 W"
    description: "Current-sense resistor from ISEN to ground, one per driver. The datasheet requires under 100 mΩ and uses 50 mΩ in its example; the 0.5 W rating is ours (about 80 mW at the limit)"
  - part: "Motor supply (not specified)"
    description: "Feeds both VM pins. 12 V nominal and at least 2.5 A; see Motor supply requirements. What provides it is left open"
  - part: "Reference voltage source (not specified)"
    description: "Provides 0.6 V on both VREF pins. What provides it is left open; see Set the current limit for what it has to do"
  - part: "Controller, 3.3 V logic"
    description: "Four outputs to IN1L, IN2L, IN1R and IN2R, each able to produce 20 kHz PWM. The inputs read above 1.5 V as high and below 0.5 V as low, so 3.3 V logic works"
tags: [motor-driver, h-bridge, brushed-dc, tracked-robot, differential-drive, current-chopping, silergy, so8e, hypothetical, setup-guide]
---

## Design requirements

| What | The design |
| --- | --- |
| Motors | Two brushed DC gear motors, one per track. Assumed: 12 V, 0.8 A running, 4 Ω winding, which would draw about 2.7 A at stall without a limit (12 V ÷ (4 Ω + 0.5 Ω)). The robot this is modelled on has 12 V gear motors with no current rating on their labels, so these current figures are our assumption |
| Motor supply | 12 V nominal, shared by both drivers. The source is left open. The driver itself takes 5–32 V and locks out below 4.7 V typical (5 V maximum) rising, with 200 mV of hysteresis |
| Stall limit | 1.2 A per motor, typical (1.14–1.26 A with the part's current-gain tolerance) |
| PWM | 20 kHz, on one logic input of each driver |
| Control logic | 3.3 V controller. Inputs read high above 1.5 V and low below 0.5 V, and accept 0–5 V |
| Reference | 0.6 V on both VREF pins, source left open |
| Heat | At most 0.8 W per driver at the limit, on the datasheet's 62 °C/W two-layer board |
| Package | SO8E with exposed pad |

> **About this guide.** This is a hypothetical design of our own. It is not a Silergy reference design, nothing in it was built or measured, and the motor is assumed. All figures come from the SY67134 numbers on the [part page](site:parts/silergy/sy67134/), which is built from the Rev 0.9 datasheet (2019). Silergy now sells the part as SY21634FCC, and the current datasheet is behind a sign-in, so check every number against the current one before building. Calculated values are marked as ours.

## How it works

A tracked robot turns by driving its two tracks at different speeds, or by running one forward and the other in reverse. That takes two independent H-bridges, so this circuit is two copies of the same channel. Each SY67134 holds the four N-channel switches of one H-bridge, a charge pump for the high-side gate drive, logic and protection. The motor sits between OUT1 and OUT2. The two channels share the motor supply and the reference voltage, and nothing else.

**Driving a channel** takes two logic inputs. The datasheet's truth table:

| IN1 | IN2 | OUT1 | OUT2 | Motor |
| --- | --- | --- | --- | --- |
| 0 | 0 | Z | Z | Coast |
| 0 | 1 | L | H | Reverse |
| 1 | 0 | H | L | Forward |
| 1 | 1 | L | L | Brake |

Either input can carry PWM of up to 100 kHz. Speed control is a choice of what the bridge does in the off part of each cycle: coast, or brake. The table below gives the four options that follow from the truth table (our reading of it; the datasheet shows the waveforms but doesn't compare them). **In the brake options the motor is driven while the PWM input is low**, so the duty you write is the inverse of the speed.

| Command | IN1 | IN2 | Motor is driven when | Off part of the cycle |
| --- | --- | --- | --- | --- |
| Forward, speed s, coast | PWM, duty s | Low | IN1 is high | Coast |
| Forward, speed s, brake | High | PWM, duty 1 − s | IN2 is low | Brake |
| Reverse, speed s, coast | Low | PWM, duty s | IN2 is high | Coast |
| Reverse, speed s, brake | PWM, duty 1 − s | High | IN1 is low | Brake |
| Hold (stop and resist turning) | High | High | Not driven | Brake |
| Free-wheel, or sleep | Low | Low | Not driven | Coast, standby after 1 ms |

Braking between pulses keeps the motor current circulating through the two low-side switches, and coasting lets it decay faster (our reading of the truth table; the datasheet doesn't compare them). Coasting is the simpler wiring because the duty equals the speed. This guide takes brake as its starting point, so every drive command in the firmware is written as an inverted duty; which one suits a given robot is something to settle on the bench.

**The current limit.** Each driver measures its own motor current across a resistor from ISEN to ground. When the voltage on ISEN reaches VREF ÷ 10, the bridge decays for a fixed 24 µs and then drives again, so the current is held near **ICHOP = VREF ÷ (10 × RSENSE)**. Here that holds each motor near 1.2 A however hard the track is stalled.

**Protection.** Overcurrent in the switches (3.65 A minimum, 4.5 A typical) turns all four off and the part retries after 3 ms. Undervoltage lockout resets the logic when VM falls below the threshold, and thermal shutdown acts at about 165 °C. All three recover on their own. The chopping limit here sits well below the overcurrent threshold, so it is the one that matters in normal use.

## Motor supply requirements

The supply is left open on purpose: any source that meets this table works. The numbers are calculated here from the assumed motor and the limit chosen below.

| Requirement | Value | Where it comes from |
| --- | --- | --- |
| Voltage | 12 V nominal, and above 5 V under load at every moment | The motor is a 12 V one; the driver's lockout is 4.7 V typical and 5 V maximum rising |
| Running current | 1.6 A for both motors (about 19 W) | 2 × 0.8 A (assumed motor) |
| Current with both motors stalled | 2.4 A at the typical limit, 2.5 A at the highest limit the gain tolerance allows (about 29–30 W) | 2 × 1.20 A, 2 × 1.26 A. An upper bound: the supply current can't exceed the motor current |
| Voltage on VM | Never above 40 V, the absolute maximum of VM, OUT1 and OUT2 | Datasheet absolute maximum |
| Returned energy | Must be absorbed | See below |

When a motor brakes or reverses, its winding current flows back into VM, and a spinning motor also acts as a generator. If the supply can't take current back, the capacitors on VM take it and the voltage rises. A driving robot that is stopped from full speed, or that reverses both tracks together, loads the supply with the sum of both motors. The datasheet gives no figure for this; the motor's inertia decides it, and so does the supply, so measure VM during a full-speed reversal on the real robot (see the bring-up checklist).

## Set the current limit

The limit is set by two parts: RSENSE and the reference voltage on VREF.

**RSENSE = 50 mΩ.** The datasheet requires under 100 mΩ and uses 50 mΩ in its own example. At 50 mΩ, the voltage on ISEN at the trip is only VREF ÷ 10 = 60 mV, far below the 0.3 V that ISEN is recommended to stay under. It dissipates ICHOP² × RSENSE, which is 72 mW at 1.2 A and 80 mW at the highest limit. A 1% part with a 0.5 W rating has plenty of room (the rating is ours).

**VREF = 0.6 V.** The limit for a given reference is in the table below; the datasheet gives the formula and a current gain of 9.5 to 10.5, so each limit can be 5% lower or higher before the tolerances of VREF and RSENSE. The calculated table:

| VREF | ISEN at the trip | Limit, typical gain (10) | Lowest (gain 10.5) | Highest (gain 9.5) |
| --- | --- | --- | --- | --- |
| 0.4 V | 40 mV | 0.80 A | 0.76 A | 0.84 A |
| 0.5 V | 50 mV | 1.00 A | 0.95 A | 1.05 A |
| **0.6 V** | **60 mV** | **1.20 A** | **1.14 A** | **1.26 A** |
| 0.75 V | 75 mV | 1.50 A | 1.43 A | 1.58 A |
| 1 V | 100 mV | 2.00 A | 1.90 A | 2.11 A |

Why 1.2 A: it is 1.5 times the assumed 0.8 A running current, which leaves room for a motor working harder on a slope, and it keeps the stalled heat in each driver to about 0.7 W (see the heat table). The datasheet's own example (1 V, 2 A) would put 2 W into a driver at stall, which is too much for this package. Choose your own limit from the motor's real running and stall currents.

**What the reference has to do.** The source is left open, so this is the whole specification, from the datasheet and from our arithmetic:

- Provide 0.6 V on each VREF pin (the part accepts 0.1–3 V; 0–3.3 V is its recommended range, and ISEN must stay within ±0.3 V, which means VREF no higher than 3 V).
- Every millivolt of error on VREF moves the limit by 2 mA, since 1 mV ÷ (10 × 50 mΩ) = 2 mA. A reference good to 1% (6 mV) moves the limit by 12 mA, 1%, which is small beside the part's own ±5% gain spread.
- The part page lists no input current for VREF (check the datasheet for it), so work out what the source can drive before sharing one source between two drivers. This guide shares one for simplicity; if in doubt, give each driver its own.
- Each pin has its own CREF of at least 0.1 µF to ground, close to the pin.

## Supply capacitors

The pin table asks for a 10 µF ceramic capacitor (CVM) from VM to GND and a sufficient electrolytic one (CBULK). The datasheet gives no value for the electrolytic. Each driver gets both, close to its own pins, so the two drivers don't share a capacitor that sits far from one of them.

The bulk capacitor supplies the motor's current pulses and absorbs returned energy. As a worst case, assume the supply gives nothing during the on part of a pulse at 50% duty and 20 kHz (25 µs). The voltage on VM then falls by I × 25 µs ÷ C. The table is calculated here, with the ceramic capacitor in parallel and ignoring ESR, which adds to the step (an electrolytic's ESR times the current):

| Bulk capacitance on VM (CBULK + CVM) | At 0.8 A | At 1.2 A | At 1.26 A |
| --- | --- | --- | --- |
| 57 µF (47 + 10) | 351 mV | 526 mV | 554 mV |
| 110 µF (100 + 10) | 182 mV | 273 mV | 287 mV |
| 230 µF (220 + 10) | 87 mV | 130 mV | 137 mV |

This is a bound, not a prediction: a real supply supplies current during the pulse. With 100 µF at each driver the worst case is about 0.3 V per driver, if the supply gave nothing during the pulse.

## Wire and drive the logic

Each driver needs two controller pins, so four in all. Because the brake commands put the PWM on IN2 for forward and on IN1 for reverse, **both pins of each driver must be able to produce PWM**. Wire them as two timer channel pairs.

- **Levels.** A 3.3 V output is above the 1.5 V high threshold and the low state is below 0.5 V. The inputs have an internal pull-down: 20–100 µA at 3.3 V (50 µA typical), so an input left unconnected reads low. The pin range is 0–5 V, 6 V absolute maximum.
- **Frequency: 20 kHz.** The part accepts up to 100 kHz, and 20 kHz is above hearing. The datasheet's supply-current figure of 3 mA maximum is stated for PWM below 30 kHz with the outputs open, so 20 kHz is inside the range it specifies. The period is 50 µs.
- **Offset the two channels.** Start the left and right PWM half a period apart (25 µs), so the two current pulses on VM don't coincide (our suggestion).
- **Standby.** If both inputs of a driver stay low for more than 1 ms, it enters standby and draws under 15 µA. With the brake commands this only happens on a free-wheel command, which is what you want when the robot sits idle. On the next command, allow up to 200 µs, which is four 20 kHz periods, for the charge pump before relying on the first pulses. If you use the coast commands instead, a speed of zero holds both inputs low and the driver sleeps by itself. The coast commands also hold both inputs low through each off part of the cycle, so keep the PWM period well under 1 ms, or the driver would drop into standby in every cycle.
- **Duty floor.** The datasheet gives no minimum input pulse width, and the dead time is 500 ns at most (by design, not tested). A pulse of a microsecond or so is 2% of a 20 kHz period. We'd start with a floor of 5% (2.5 µs) and measure; below it, command a stop or the free-wheel state.
- **Steering.** Mix a throttle t and a turn r as left = t + r and right = t − r, limited to −1 to +1. A pivot turn is the case where one side is reversed.

## Heat

Each channel's heat comes from the motor current through one high-side and one low-side switch, which the datasheet gives only as a combined 500 mΩ maximum at 25 °C. The table is calculated here as I² × 500 mΩ, with the 62 °C/W of the datasheet's two-layer evaluation board. The motor current is the continuous current, the switching loss and the charge pump aren't counted, and the on-resistance rises with temperature in practice, so treat the numbers as a floor.

| Case | Current | Loss | Rise | Junction at 25 °C | At 60 °C | At 85 °C | Highest ambient for 125 °C |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Running | 0.80 A | 0.32 W | 20 °C | 45 °C | 80 °C | 105 °C | 105 °C |
| At the limit, lowest gain | 1.14 A | 0.65 W | 40 °C | 65 °C | 100 °C | about 125 °C | 85 °C |
| At the limit, typical | 1.20 A | 0.72 W | 45 °C | 70 °C | 105 °C | 130 °C | 80 °C |
| At the limit, highest gain | 1.26 A | 0.80 W | 49 °C | 74 °C | 109 °C | 134 °C | 76 °C |

Running is comfortable. A motor held stalled at the limit is fine in a warm room, but above about 76–85 °C ambient (depending on where in the gain tolerance the part sits) it would exceed the 125 °C junction limit. The thermal shutdown at 165 °C is far away, so the part would not protect itself in that range; don't hold a stall for long at a high ambient. With both drivers at the limit the board makes 1.3–1.6 W in total, from two separate packages, so keep them apart.

## Bring-up checklist

Everything below is a plan, not a record: this design has not been built. The expected values are calculated from the datasheet.

1. **Motors off, supply limited.** Leave the motors disconnected and set the supply's own current limit low (our suggestion: 200 mA). Check the 12 V on both VM pins and 0.6 V on both VREF pins before any logic is applied.
2. **Standby current.** With both inputs of both drivers low for more than 1 ms, the current drawn from the supply should fall to the standby limit, 15 µA per driver (30 µA for two). Measure with a meter in series, and only the drivers on that supply path.
3. **Truth table.** With no motor connected, drive each combination and check the outputs with a meter: forward (IN1 high, IN2 low) gives OUT1 high and OUT2 low; reverse gives the opposite; both high gives both low. Both low leaves the outputs floating, so a meter reads nothing meaningful there.
4. **Motor spins the right way.** Connect the motors and raise the supply limit. Run each at 10%, 50% and 100% in both directions. If a track runs backwards, swap its OUT1 and OUT2 wires or invert it in firmware, and keep the left and right conventions the same.
5. **Limit.** Hold a shaft stalled for a second or two. The bridge should chop: ISEN peaks around 60 mV on a scope (VREF ÷ 10), which is 1.14–1.26 A, and the current drawn from the supply drops. Feel the driver afterwards.
6. **Return energy.** Run both motors at full speed and reverse them together. Watch VM at the pins with a scope: it must stay below 40 V (absolute maximum) and above 5 V (the lockout).
7. **PWM offset.** Look at the VM ripple with the two channels in phase and half a period apart.

## Layout

The datasheet's layout guidance is a recommended SO8E footprint and the notes in its pin table. The rest are our suggestions:

- **Ground the exposed pad** with as much copper as the board allows on both layers and vias under the pad. The 62 °C/W figure is for a two-layer board.
- **CVM at the pins.** Put the 10 µF ceramic right at VM and GND of each driver, with the bulk capacitor next to it.
- **CREF at the VREF pin,** with at least 0.1 µF to ground.
- **RSENSE returns directly to the driver's ground.** Any copper that the motor current shares with the sense path adds to what ISEN sees: 5 mΩ of shared trace on a 50 mΩ resistor moves the limit by 10%. Connect the sense resistor's low side to the exposed pad area, not to a far ground.
- **Keep the two drivers apart,** and keep the VREF and logic traces away from OUT1, OUT2 and the motor wires.
- **Motor wires:** keep them short, and put the connector near the driver.

## Things to watch

- **Hypothetical.** Nothing here was built or measured, and no real motor was characterised. The 0.8 A running current and the 4 Ω winding are our assumption, and the limit should be chosen from the real motor's running and stall currents.
- **Brake commands use the inverse of the speed.** In the two brake options the motor is driven while the PWM input is low, so a duty of 80% means 20% speed. Write the firmware around this, and test the zero and full-speed ends first.
- **Coast commands can put the driver to sleep.** Both inputs low for 1 ms means standby, and the charge pump takes up to 200 µs to come back. Don't run PWM near or below 1 kHz.
- **No minimum pulse width in the datasheet.** The 5% floor is our guess.
- **The limit is a stall limit, not a short-circuit protection.** A short on the outputs is for the overcurrent protection: 3.65 A minimum, 4.5 A typical, then a 3 ms retry. The chopping limit holds a stalled motor, not a shorted wire.
- **The reference's input current is not on the part page.** Check the datasheet, and the source, before sharing one reference between two drivers.
- **The lockout is the minimum supply.** VM must stay above 5 V at all times. Two motors starting together can pull a weak supply under that, and the part resets. The hysteresis is 200 mV.
- **3.6 A is a rating, not a continuous current.** On the datasheet's board the part carries about 1.1–1.8 A continuously (see the part page), and the heat table above shows why the limit here is 1.2 A.
- **The datasheet is Rev 0.9 from 2019.** It has no revision history, and the part has since been renamed SY21634FCC. The numbers may have changed.

## Documents and related parts

- [SY67134 part page](site:parts/silergy/sy67134/): specifications, truth table, chopping-current and heat tables, and the datasheet's own typical application
- [SY67134 / SY21634FCC product page](https://www.silergy.com/productsview/SY21634FCC): Silergy's page for the part. Downloading the datasheet needs a MySilergy sign-in
- [SY2A58215 part page](site:parts/silergy/sy2a58215/): a 15 A automotive Silergy H-bridge driver for brushed motors, for comparison
