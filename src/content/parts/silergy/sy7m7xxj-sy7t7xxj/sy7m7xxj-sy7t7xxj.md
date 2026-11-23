---
manufacturer: Silergy
family: SY7M7xxJ / SY7T7xxJ
part: SY7M7xxJ / SY7T7xxJ
category: processor
summary: 'Electricity metering SoC family: Cortex-M0, 64-bit compute engine, 512 KB flash, three current ADCs plus a multiplexed ADC, 3.0 to 3.6 V, LQFP-100, LQFP-128 or QFN-68.'
abstract: 'A family of electricity metering systems on a chip for polyphase and single or dual-phase meters, sub-meters, EV chargers and power monitors. Three staring ADCs read the currents and one multiplexed ADC reads the phase voltages and the neutral current, and a 64-bit compute engine at 40 MHz does the metering arithmetic from its own RAM while a Cortex-M0 at 40 MHz runs the meter firmware. Current sensors can be CTs, Rogowski coils or shunts read through up to three SY7M007 isolated remote ICs. The chip adds 512 KB of flash, a real-time clock with temperature compensation, an LCD driver, six UARTs, SPI and I2C ports, AES, SHA-2, elliptic-curve and random-number hardware, and four power modes that keep the clock and tamper wake-ups running from a battery. Six versions cover three packages: LQFP-100, LQFP-128 and QFN-68.'
status: active
packages:
- LQFP-100 (14 × 14 mm)
- LQFP-128 (14 × 14 mm)
- QFN-68 (8 × 8 mm)
specs:
  vin_min_v: 3.0
  vin_max_v: 3.6
  topology: 'Metering SoC: Cortex-M0 (40 MHz), 64-bit compute engine (40 MHz), 512 KB flash, three staring ADCs and one multiplexed ADC'
  extra:
  - label: Versions
    value: Poly-phase SY7M713J (LQFP-100), SY7T733J (QFN-68), SY7M763J (LQFP-128); single or dual-phase SY7M712J, SY7T732J, SY7M762J, same packages
  - label: Accuracy
    value: ±0.1% Wh over a 5,000 to 1 current range in CT mode (title page)
  - label: Supply
    value: 3.0 V to 3.6 V in mission mode; battery pins from 2.5 V (brownout) and 2.0 V (sleep, LCD-only)
  - label: Current inputs
    value: 'Three staring ADCs: CTs, Rogowski coils, or shunts through up to three SY7M007 remote ICs; ±125 mV peak'
  - label: Voltage inputs
    value: 'Multiplexed ADC: three phase voltages and neutral current, ±125 mV peak; sample rate up to 8 kHz'
  - label: Memory
    value: 512 KB flash; RAM size is given three different ways in the datasheet (see Datasheet notes)
  - label: Serial
    value: Six UARTs, two SPI masters, one SPI slave, two I2C ports (one shared with SPI pins)
  - label: Security
    value: AES 128/192/256, SHA-2 256/384/512, P-256/P-384 elliptic curve, 32-bit true random number generator
  - label: Sleep current
    value: 1 µA on the title page; 4 µA typical, 6 µA maximum in the electrical table (VBAT)
features:
- Cortex-M0 MPU up to 40 MHz and a separate 64-bit compute engine at 40 MHz that does the metering calculations from its own RAM
- Three staring ADCs for current and one multiplexed ADC for voltages and neutral current, with programmable FIR decimation and sampling up to 8 kHz
- Works with CTs, Rogowski coils, or shunts through up to three capacitively coupled SY7M007 remote ICs powered over a transformer from two pulse-driver pins
- 512 KB flash with copy and debug protection; programmed and debugged over serial wire (SWD)
- Real-time clock with a 1-second pulse output and cubic temperature compensation; one 32.768 kHz crystal provides every clock, with an internal RC oscillator as backup
- 'Four power modes: mission, brownout (metering continues from a battery on VBAT), LCD-only and sleep, with wake on timer, GPIO edge, UART receive and a comparator'
- LCD driver with up to 8 commons, up to 15 pre-loaded display pages and a charge pump for a 5 V panel; automatic blinking on two segments
- Six UARTs, two SPI masters, an SPI slave, I2C, four PWM outputs and two pulse-generator outputs; every GPIO can interrupt
- AES, SHA-2, elliptic-curve and true-random-number hardware
- On-chip die temperature sensor and battery voltage monitor with a de-passivation load
- Silergy supplies the compute-engine code as a precompiled binary; the engine is not user programmable
spec_groups:
- title: Supply and power modes
  items:
  - label: V3P3SYS and V3P3A, mission mode
    value: 3.0 V minimum, 3.6 V maximum (the tables use 3.3 V); absolute maximum 3.6 V
  - label: Supply fall rate
    value: No faster than 100 mV per ms when battery modes are used, or the switch-over to VBAT can fail
  - label: VBAT, brownout mode
    value: 2.5 V to 3.6 V; absolute maximum 3.8 V
  - label: VBAT_RTC, sleep and LCD-only modes
    value: 2.0 V to 3.6 V; absolute maximum 3.8 V
  - label: Operating temperature
    value: −40 °C to +85 °C in all modes
  - label: Mission-mode current, full speed
    value: V3P3SYS 5.1 mA typical, 6.5 mA maximum, plus V3P3A 5.0 mA typical, 6.6 mA maximum (10.1 mA and 13.1 mA together). Multiplexed ADC at 5.111 MHz, three staring ADCs at 1.704 MHz, preamp enabled, standard CE code, MPU at 10.224 MHz
  - label: Mission-mode current, half-speed ADCs
    value: V3P3SYS 3.1 mA typical, 4 mA maximum, plus V3P3A 2.3 mA typical, 3 mA maximum; multiplexed ADC at 2.556 MHz and staring ADCs at 0.852 MHz
  - label: Dynamic current
    value: 138 µA per MHz on V3P3SYS with remotes, both ADC types and the compute engine off
  - label: Brownout-mode current (VBAT)
    value: 10 mA typical, 12.3 mA maximum, same conditions as the full-speed mission row
  - label: Battery pins in mission mode
    value: VBAT and VBAT_RTC both 0 typical, 100 nA maximum
  - label: LCD-only mode (VBAT)
    value: 5 µA typical, 8 µA maximum with the LCD DAC off and the slowest LCD clock; 10 µA and 16 µA with the DAC on at code 0; 40 µA and 64 µA with the DAC at 0x1F
  - label: LCD-only mode (VBAT_RTC)
    value: 0 typical, 100 nA maximum
  - label: Sleep mode (VBAT, with VBAT_RTC tied to VBAT)
    value: 4 µA typical, 6 µA maximum, RTC compensation off; VBAT_RTC then draws 0 typical, 100 nA maximum
  - label: Sleep mode (VBAT_RTC, VBAT = 0 V)
    value: 1.2 µA typical, 2.7 µA maximum, RTC compensation off
- title: Power-fault comparators and switches
  items:
  - label: V3AOK threshold
    value: Falling 2.7 V minimum, 2.8 V typical; rising 2.83 V typical, 2.93 V maximum; hysteresis 35 mV
  - label: V3OK threshold
    value: Falling 2.28 V minimum, 2.43 V typical; rising 2.45 V typical, 2.62 V maximum; hysteresis 30 mV
  - label: V3P3DOK threshold
    value: Falling 2.09 V minimum, 2.28 V typical; rising 2.36 V typical, 2.55 V maximum; hysteresis 80 mV
  - label: VBATOK threshold
    value: Falling 2.26 V minimum, 2.42 V typical; rising 2.45 V typical, 2.62 V maximum; hysteresis 30 mV
  - label: VDDOK threshold
    value: 'Internal design specification, not measurable: falling 1.9 V minimum, rising 2.2 V maximum; hysteresis 45 mV'
  - label: Comparator response
    value: 2 clocks of the 32 kHz oscillator for each comparator, with filters, at 100 mV overdrive
  - label: Cold-start threshold
    value: 1.3 V typical, 1.95 V maximum (all supplies lowered from 2.3 V until the cold-start flag is set)
  - label: WAKE_COMP threshold
    value: 1.05 V minimum, 1.2 V typical, 1.35 V maximum, rising; the part leaves sleep mode
  - label: V3P3D switch resistance
    value: From V3P3SYS 4 Ω typical, 8 Ω maximum at up to 7 mA; from VBAT 7 Ω typical, 15 Ω maximum (VBAT above 2.5 V)
  - label: V3P3D drive
    value: 8 mA minimum source in mission mode (V3P3SYS 3.0 V, V3P3D 2.9 V); 5 mA minimum sink in brownout mode (VBAT 2.6 V, V3P3D 2.5 V)
  - label: V3P3D change-over
    value: 8 clocks of 32 kHz after V3OK falls, then the pin may slew at no more than 1 V/ms (the table prints the unit as V/mV)
  - label: V3P3RTC switch resistance
    value: 50 Ω typical, 80 Ω maximum at up to 1 mA, from V3P3SYS, VBAT or VBAT_RTC (above 2.5 V)
- title: Digital I/O
  items:
  - label: Input low, most DIO pins
    value: 0.15 × V3P3D maximum
  - label: Input low, DIO39 to DIO43, RST, TEST
    value: 0.15 × V3P3RTC maximum
  - label: Input high, most DIO pins
    value: 0.7 × V3P3D minimum
  - label: Input high, DIO39 to DIO43, RST, TEST
    value: 0.75 × V3P3RTC minimum
  - label: Schmitt hysteresis
    value: 0 V typical on most DIO pins; 0.5 V typical on DIO38 to DIO43 and DIO72
  - label: Input leakage
    value: −1 µA to +1 µA with the pull-up off; DIO16 to DIO20 ±1 µA with 5.5 V applied
  - label: Pull-up and pull-down resistance
    value: Pull-up 43 kΩ minimum, 74 kΩ typical, 105 kΩ maximum; pull-down 40 kΩ, 70 kΩ, 100 kΩ. DIO16 to DIO20 are 5 V tolerant and have neither
  - label: RST and TEST
    value: Internal pull-down current 160 µA typical, 245 µA maximum; low-level leakage 0.5 µA typical, 2 µA maximum
  - label: Output low
    value: 0.5 V maximum at 8 mA
  - label: Output high
    value: 'V3P3D − 0.65 V minimum at 8 mA; DIO38 to DIO43: V3P3RTC − 0.5 V minimum at 0.5 mA'
  - label: Pulse width
    value: Positive spikes shorter than 1.2 µs are ignored on DIO38 to DIO43, RST and TEST (4 µs typical); the pin must be held 11.5 µs to be sure of being seen
  - label: In battery modes
    value: Digital inputs should be below 0.1 V or above the battery voltage minus 0.1 V, to limit battery current
- title: Multiplexed ADC (ADCM)
  items:
  - label: Usable input range
    value: −125 mV to +125 mV peak
  - label: Input impedance
    value: 14 kΩ minimum, 27 kΩ maximum
  - label: Input offset
    value: −10 mV to +10 mV
  - label: Supply current
    value: 1 mA typical, 1.35 mA maximum (staring ADCs disabled, 2.555904 MHz clock)
  - label: FIR lengths
    value: 264, 288, 312, 336, 360 or 384 clocks, giving 187.2, 144.2, 113.4, 90.8, 73.8 or 60.8 nV per LSB
  - label: Full scale in codes
    value: 851,840 (264 clocks) up to 2,621,440 (384 clocks)
  - label: THD
    value: −85 dB at 10 mV and at 125 mV peak, 55 Hz
  - label: Noise
    value: 400 LSB; input-referred noise density 2,000 nV/√Hz (20 mV peak, 55 Hz, 384 clocks)
  - label: Gain error
    value: ±50 ppm per % of supply change (not tested in production); ±0.005 nV/°C LSB drift (not tested in production)
- title: Staring ADCs (ADCS)
  items:
  - label: Usable input range
    value: −125 mV to +125 mV peak with the preamp off; −15.62 mV to +15.62 mV with the preamp on
  - label: Input impedance
    value: Preamp off 28 kΩ to 85 kΩ; preamp on 2.5 kΩ to 10 kΩ
  - label: Sample rate
    value: 2521, 2731, 2979, 3277, 3641, 4096, 4681, 5461, 6554 or 8192 Hz, from an 851.968 kHz ADC clock
  - label: LSB size
    value: 4.13 nV (2521 Hz) up to 141.77 nV (8192 Hz); full scale 38,614,472 to 1,124,864 codes
  - label: Input offset
    value: −4 mV to +4 mV, with the preamp on or off
  - label: Supply current, three ADCs
    value: 1.1 mA typical, 1.5 mA maximum; preamp adds 0.11 mA typical, 0.14 mA maximum per IAP/IAN input
  - label: Preamp gain
    value: 7.9 V/V typical (7.7 to 8.1); input current 17 µA minimum, 31 µA typical, 42 µA maximum
  - label: Preamp drift
    value: Gain ±240 ppm per % of supply, ±110 ppm/°C; phase 9 m° typical, ±65 m° per volt, ±0.3 m°/°C
  - label: THD
    value: −85 dB, preamp on (10 mV peak) or off (125 mV peak)
  - label: Noise
    value: 400 LSB preamp off, 425 LSB preamp on, at the 2521 Hz setting; input density 300 nV/√Hz in both cases
  - label: Gain error
    value: Preamp off ±105 to ±200 ppm per % of supply change depending on channel and bias; with preamp ±280 to ±310 ppm (ADCS0). Drift ±0.007 nV/°C LSB (±0.002 with preamp)
  - label: Tested in production
    value: The preamp rows (range, input resistance, gain, input current, phase shift, noise) are marked as not tested in production
- title: Reference, sensors and oscillators
  items:
  - label: VREF
    value: 1.191 V minimum, 1.197 V typical, 1.203 V maximum at 22 °C, trimmed; supply rejection ±1.5 mV/V
  - label: VREF deviation from the nominal curve
    value: ±35 ppm/°C for the LQFP-100 and LQFP-128 parts; ±55 ppm/°C for the QFN-68 parts
  - label: VREF buffer
    value: −15 mV to +15 mV from the bandgap voltage
  - label: Temperature sensor
    value: Relative error ±2 °C from −40 °C to +85 °C (not tested in production); 0.12 °C standard deviation; 26 ms typical, 60 ms maximum per measurement
  - label: Battery monitor
    value: 25 mV per LSB; error ±100 mV from 2.4 V to 3.8 V; de-passivation load 50 µA minimum, 85 µA typical, 120 µA maximum; input impedance 260 kΩ to 530 kΩ
  - label: Internal oscillator
    value: 32.76 kHz typical, ±2%, ±0.4 kHz per volt of supply change
  - label: Crystal oscillator
    value: 32.768 kHz; transconductance 8 µS to 50 µS; peak source current 0.4 µA to 1.7 µA; ±0.5 ppm over VBAT_RTC 2.5 V to 3.8 V (not tested in production)
- title: Remote sensor interface
  items:
  - label: Receiver supply current
    value: One remote 700 µA typical, 900 µA maximum; two 1,050 and 1,400 µA; three 1,450 and 1,850 µA
  - label: Input bias and resistance
    value: Bias 1.71 V to 1.91 V; differential resistance 3.2 kΩ to 7 kΩ (r2k_en = 1) or 100 kΩ to 220 kΩ (r2k_en = 0)
  - label: Propagation delay and offset
    value: 25 ns typical rising or falling; input offset within ±12 mV to ±15 mV depending on common mode
  - label: Power-pulse driver
    value: 'RMT_DRIVE_H and DIO72: 0.4 V maximum drop at 20 mA'
- title: Serial ports, LCD and memory
  items:
  - label: I2C master
    value: 100 kHz or 400 kHz
  - label: SPI master 0
    value: 100 kHz or 1 MHz
  - label: SPI master 1
    value: 10, 5, 2.5 or 0.5 MHz
  - label: SPI slave
    value: Setup 10 ns, hold 10 ns, output delay 40 ns maximum, clock high and low 40 ns each; MPU clock at least twice the SPI clock (not tested in production)
  - label: PWM
    value: Four outputs up to 2.5 MHz; two on the QFN-68 parts
  - label: LCD bias impedance
    value: 9 kΩ to 16 kΩ on VLC1 and VLC0; VLCD current 3 µA typical, 5.5 µA maximum
  - label: LCD DAC
    value: Zero scale 2.57 V typical; full scale follows the supply (3.57 V at 3.6 V) without the boost, 5.06 V typical with the boost
  - label: Flash
    value: 100,000 program/erase cycles; 10 years at 85 °C; word program 20 µs, page erase 2 ms, mass erase 10 ms (not tested in production)
  - label: True random number generator
    value: Slow clock 250 to 490 kHz (345.7 kHz typical), fast clock 3 to 11 MHz (6.0 MHz typical)
- title: Package, ratings and thermal
  items:
  - label: Absolute maximum, supplies
    value: V3P3SYS and V3P3A −0.5 V to 3.6 V; VBAT and VBAT_RTC −0.5 V to 3.8 V; VDD −0.5 V to 3.0 V; VLCD −0.5 V to 5.0 V
  - label: Absolute maximum, pins
    value: Analog inputs −0.5 V to V3P3A + 0.5 V, ±10 mA; XIN and XOUT −0.5 V to 3.0 V; LCD pins −0.5 V to VLCD + 0.5 V, ±1 mA; DIO −0.5 V to V3P3D + 0.5 V, ±10 mA (DIO16 to DIO20 up to 5.5 V; DIO38 or DIO39 to DIO43 against V3P3RTC)
  - label: Junction temperature
    value: 125 °C continuous, 140 °C for 100 ms; storage −45 °C to +165 °C; solder 260 °C for 10 s
  - label: ESD
    value: ±2 kV human-body model on all pins
  - label: Thermal resistance θJA
    value: LQFP-100 53.26 °C/W, LQFP-128 40.51 °C/W, QFN-68 30.16 °C/W (still air, four-layer Silergy board)
  - label: Thermal resistance θJC (bottom)
    value: LQFP-100 9.03 °C/W, LQFP-128 11.02 °C/W, QFN-68 7.02 °C/W
  - label: Maximum power at 25 °C
    value: LQFP-100 2.35 W, LQFP-128 3.09 W, QFN-68 4.14 W
  - label: Body size and reel
    value: LQFP 14 × 14 mm, QFN 8 × 8 mm (from the tape drawings); 1,000 per reel for the LQFPs, 2,500 for the QFN
design_tables:
- title: 'Staring ADC: sample rate, LSB and range (calculated check of the datasheet table)'
  note: The first three data columns are the datasheet table. "LSB from formula" uses the datasheet formula LSB = (VREF / 2) × (1.25 / 4.75) × (1 / L)³ with the typical VREF of 1.197 V. The next column is the number of codes at the ±125 mV peak input limit, using the printed LSB. Full scale in codes is L³ (matches the printed table in every row). Calculated.
  columns:
  - Clocks L
  - Sample rate
  - Printed LSB
  - LSB from formula
  - Codes at 125 mV
  - Full scale in codes
  rows:
  - - '338'
    - 2521 Hz
    - 4.13 nV
    - 4.08 nV
    - 30.27 million
    - 38,614,472
  - - '312'
    - 2731 Hz
    - 5.25 nV
    - 5.19 nV
    - 23.81 million
    - 30,371,328
  - - '286'
    - 2979 Hz
    - 6.82 nV
    - 6.73 nV
    - 18.33 million
    - 23,393,656
  - - '260'
    - 3277 Hz
    - 9.07 nV
    - 8.96 nV
    - 13.78 million
    - 17,576,000
  - - '234'
    - 3641 Hz
    - 12.45 nV
    - 12.29 nV
    - 10.04 million
    - 12,812,904
  - - '208'
    - 4096 Hz
    - 17.72 nV
    - 17.50 nV
    - 7.05 million
    - 8,998,912
  - - '182'
    - 4681 Hz
    - 26.45 nV
    - 26.13 nV
    - 4.73 million
    - 6,028,568
  - - '156'
    - 5461 Hz
    - 42.01 nV
    - 41.49 nV
    - 2.98 million
    - 3,796,416
  - - '130'
    - 6554 Hz
    - 75.59 nV
    - 71.69 nV
    - 1.65 million
    - 2,197,000
  - - '104'
    - 8192 Hz
    - 141.77 nV
    - 140.02 nV
    - 0.88 million
    - 1,124,864
- title: 'Multiplexed ADC: LSB by FIR length (calculated check)'
  note: Printed LSB from the datasheet; formula LSB = (VREF / 2) × (1.25 / 4.75) × (3 / L)³ × (4 / 5) with VREF = 1.197 V. Full scale in codes is (L / 3)³ × 5 / 4, which equals the printed value in every row.
  columns:
  - FIR clocks L
  - Printed LSB
  - LSB from formula
  - Codes at 125 mV
  - Full scale in codes
  rows:
  - - '384'
    - 60.8 nV
    - 60.08 nV
    - 2.06 million
    - 2,621,440
  - - '360'
    - 73.8 nV
    - 72.92 nV
    - 1.69 million
    - 2,160,000
  - - '336'
    - 90.8 nV
    - 89.68 nV
    - 1.38 million
    - 1,756,160
  - - '312'
    - 113.4 nV
    - 112.01 nV
    - 1.10 million
    - 1,406,080
  - - '288'
    - 144.2 nV
    - 142.42 nV
    - 0.87 million
    - 1,105,920
  - - '264'
    - 187.2 nV
    - 184.89 nV
    - 0.67 million
    - 851,840
- title: Supply current and power in mission mode (calculated)
  note: Currents are the datasheet rows for V3P3SYS plus V3P3A (typical and maximum), with the test conditions given on the page. Power is the current times 3.3 V for typical and 3.6 V for maximum. The last row uses the dynamic current of 138 µA per MHz (V3P3SYS, remotes, ADCs and CE off) and is our extrapolation, not a datasheet figure.
  columns:
  - Condition
  - Typical current
  - Maximum current
  - Typical power
  - Maximum power
  rows:
  - - Mission mode, preamp enabled (rows 1)
    - 5.1 + 5.0 = 10.1 mA
    - 6.5 + 6.6 = 13.1 mA
    - 33 mW at 3.3 V
    - 47 mW at 3.6 V
  - - Mission mode, preamp bit cleared (rows 2)
    - 5.1 + 4.9 = 10.0 mA
    - 6.5 + 6.3 = 12.8 mA
    - 33 mW at 3.3 V
    - 46 mW at 3.6 V
  - - Mission mode, half-speed ADCs (rows 3)
    - 3.1 + 2.3 = 5.4 mA
    - 4.0 + 3.0 = 7.0 mA
    - 18 mW at 3.3 V
    - 25 mW at 3.6 V
  - - Added by raising the MPU clock from 10.224 to 40 MHz
    - (40 − 10.224) × 0.138 = 4.1 mA
    - not given
    - 13.6 mW at 3.3 V
    - not given
- title: RTC battery life per 100 mAh of capacity (calculated)
  note: Capacity divided by the sleep-mode current, with nothing else drawing from the cell. It ignores battery self-discharge, temperature and the RTC temperature-compensation current, so real life is shorter. The 4 µA and 6 µA rows are the VBAT pin with the RTC compensation disabled.
  columns:
  - Condition
  - Typical current
  - Maximum current
  - Life at typical
  - Life at maximum
  rows:
  - - Sleep, VBAT_RTC with VBAT = 0 V (IVBAT_RTC_7)
    - 1.2 µA
    - 2.7 µA
    - 9.5 years
    - 4.2 years
  - - 'Sleep, both pins on one battery: VBAT (IVBAT_14)'
    - 4 µA
    - 6 µA
    - 2.9 years
    - 1.9 years
  - - Title-page sleep figure
    - 1 µA
    - not given
    - 11.4 years
    - not given
- title: V3P3D bypass capacitor and the 1 V/ms slew limit (calculated)
  note: In battery modes V3P3D slews at no more than −1 V/ms (the datasheet prints the unit as V/mV, see Datasheet notes). The load current that fits that limit is C × 1 V/ms. The droop columns assume the capacitor alone supplies the pin during the 8 clocks (244 µs) it takes the V3P3D switch to change over.
  columns:
  - Capacitor
  - Load current at 1 V/ms
  - Droop at 1 mA load
  - Droop at 7 mA load
  rows:
  - - 0.1 µF
    - 100 µA
    - 2.44 V
    - 17.08 V
  - - 1 µF
    - 1000 µA
    - 0.24 V
    - 1.71 V
  - - 10 µF
    - 10 mA
    - 0.02 V
    - 0.17 V
- title: Die temperature from the sensor reading (calculated)
  note: T = 22.77 + 0.08425 × d − 2.15e-6 × d² − 1.234e-9 × d³, where d = stemp − stempCAL. At d = 0 the result is 22.77 °C, not the temperature at which stempCAL was taken. The datasheet gives the equation for 2.0 V to 3.8 V supply, ±2 °C relative error (not tested in production).
  columns:
  - d (stemp − stempCAL)
  - Die temperature
  rows:
  - - '-800'
    - -45.4 °C
  - - '-600'
    - -28.3 °C
  - - '-400'
    - -11.2 °C
  - - '-200'
    - 5.8 °C
  - - '0'
    - 22.8 °C
  - - '200'
    - 39.5 °C
  - - '400'
    - 56.0 °C
  - - '600'
    - 72.3 °C
  - - '800'
    - 88.2 °C
- title: Battery monitor reading by battery voltage (calculated)
  note: VB = −0.059 + 0.025 × bsense at the reference temperature (stemp = stemp22), so bsense = (VB + 0.059) / 0.025. The datasheet nominal is 124 at 3.0 V (120 to 128), which is 41 mV above this line; the measurement error limit is ±100 mV.
  columns:
  - Battery voltage
  - bsense (exact)
  - bsense (rounded)
  - Note
  rows:
  - - 2.4 V
    - '98.4'
    - '98'
    - lowest voltage the monitor is specified for
  - - 2.5 V
    - '102.4'
    - '102'
    - lowest BRN-mode battery
  - - 3.0 V
    - '122.4'
    - '122'
    - datasheet nominal point
  - - 3.3 V
    - '134.4'
    - '134'
    - ''
  - - 3.6 V
    - '146.4'
    - '146'
    - highest recommended
  - - 3.8 V
    - '154.4'
    - '154'
    - absolute maximum
- title: Bandgap temperature coefficient by TRIM_BGT (calculated)
  note: TC1S (linear) = a − b × TRIM_BGT, per package, from the datasheet equations. TRIM_BGT is a signed value from −128 to 127 read from the Info Block. The percent figure divides the LQFP-100 value by 1.197 V.
  columns:
  - TRIM_BGT
  - TC1S, LQFP-100
  - TC1S, LQFP-128
  - TC1S, QFN-68
  - TC2S, LQFP-100
  rows:
  - - '-128'
    - 22.96 µV/°C (19.2 ppm/°C)
    - 18.21 µV/°C
    - 29.40 µV/°C
    - -4.81 nV/°C²
  - - '-64'
    - 15.02 µV/°C (12.6 ppm/°C)
    - 11.93 µV/°C
    - 19.32 µV/°C
    - -4.11 nV/°C²
  - - '-17'
    - 9.20 µV/°C (7.7 ppm/°C)
    - 7.33 µV/°C
    - 11.92 µV/°C
    - -3.61 nV/°C²
  - - '0'
    - 7.09 µV/°C (5.9 ppm/°C)
    - 5.66 µV/°C
    - 9.24 µV/°C
    - -3.42 nV/°C²
  - - '63'
    - -0.72 µV/°C (-0.6 ppm/°C)
    - -0.51 µV/°C
    - -0.68 µV/°C
    - -2.74 nV/°C²
  - - '127'
    - -8.66 µV/°C (-7.2 ppm/°C)
    - -6.78 µV/°C
    - -10.76 µV/°C
    - -2.05 nV/°C²
- title: Signal at the 120 µΩ shunt of the datasheet accuracy plot (calculated)
  note: Voltage across 120 µΩ at the currents on the Wh accuracy plot (0.01 A to 100 A, 240 V, 50 Hz, shunt measurement). Peak is the rms value × 1.414; counts divide the peak by the 4.13 nV LSB of the 2521 Hz setting. The datasheet quotes ADC noise as 400 LSB at that setting without saying whether it is rms or peak-to-peak.
  columns:
  - Current (rms)
  - Voltage (rms)
  - Voltage (peak)
  - Peak in LSB
  rows:
  - - 0.02 A
    - 2.4 µV
    - 3.4 µV
    - '822'
  - - 0.1 A
    - 12.0 µV
    - 17.0 µV
    - 4,109
  - - 1 A
    - 120.0 µV
    - 169.7 µV
    - 41,091
  - - 10 A
    - 1.20 mV
    - 1.70 mV
    - 410,910
  - - 100 A
    - 12.00 mV
    - 16.97 mV
    - 4,109,095
- title: LCD DAC voltage with boost (calculated, our reading of the formula)
  note: The printed formula is VLCD_DAC = 2.55 × (1 + lcd_dac[4:0] / 33.5). We read the fraction as applying to lcd_dac only, because that is the reading that agrees with the zero-scale and mid-scale rows of the boost tables. Without boost the output stops at the supply voltage.
  columns:
  - lcd_dac
  - Formula
  - Datasheet table row
  rows:
  - - 0 (0x00)
    - 2.55 V
    - zero scale, typical 2.54 V (min 2.42, max 2.66)
  - - 8 (0x08)
    - 3.16 V
    - ''
  - - 16 (0x10)
    - 3.77 V
    - ''
  - - 19 (0x13)
    - 4.00 V
    - mid scale, typical 4.08 V (min 3.96, max 4.2)
  - - 24 (0x18)
    - 4.38 V
    - ''
  - - 31 (0x1F)
    - 4.91 V
    - full scale, typical 5.06 V (min 4.9, max 5.2)
- title: Flash programming time (calculated)
  note: 'From the flash table: 20 µs per 32-bit word, 2 ms per 1 KB page, 10 ms for a mass erase. Times for the programming loop itself; code overhead and verification are not included.'
  columns:
  - Operation
  - Time
  - Basis
  rows:
  - - One 32-bit word
    - 20 µs
    - Typical, from the table
  - - One 1 KB page (256 words) plus its erase
    - 5.12 ms + 2 ms = 7.1 ms
    - Page erase 2 ms
  - - All 512 KB, programmed word by word
    - 2.62 s
    - 131,072 words × 20 µs
  - - All 512 KB, page erase first
    - 1.02 s erase (512 pages × 2 ms) + 2.62 s = 3.6 s
    - Or one mass erase, 10 ms, then 2.62 s
- title: Power the package can dissipate at 85 °C ambient (calculated)
  note: 'The datasheet maximum power dissipation at 25 °C equals (150 − 25) / θJA, so it assumes a 150 °C junction. The last column uses the 125 °C continuous junction limit from the ratings table and the 85 °C operating limit: (125 − 85) / θJA.'
  columns:
  - Package
  - θJA
  - Datasheet maximum at 25 °C
  - 'Check: (150 − 25) / θJA'
  - At 85 °C ambient, 125 °C junction
  rows:
  - - LQFP-100
    - 53.26 °C/W
    - 2.35 W
    - 2.35 W
    - 0.75 W
  - - LQFP-128
    - 40.51 °C/W
    - 3.09 W
    - 3.09 W
    - 0.99 W
  - - QFN-68
    - 30.16 °C/W
    - 4.14 W
    - 4.14 W
    - 1.33 W
datasheet: https://www.silergy.com/download/downloadFile?id=6420&type=product&ftype=note
datasheet_revision: Rev. 1.4 (8/2025, PDS_SY7M7xxJ, 44 pages)
verified: true
draft: true
tags:
- electricity metering
- energy meter
- smart meter
- polyphase
- single-phase
- cortex-m0
- soc
- rtc
- lcd driver
- encryption
- ev charging
---

## How it works

The SY7M7xxJ and SY7T7xxJ are electricity metering systems on a chip. One datasheet covers six versions in three packages. The "M" parts are in LQFP packages and the "T" parts are in a QFN package. The "3" in the poly-phase part numbers and the "2" in the single/dual-phase ones is the only difference between the two kinds of version, as the ordering table shows.

| Version | Application | Package |
| --- | --- | --- |
| SY7M713J | Poly-phase | LQFP-100 |
| SY7T733J | Poly-phase | QFN-68 |
| SY7M763J | Poly-phase | LQFP-128 |
| SY7M712J | Single/dual-phase | LQFP-100 |
| SY7T732J | Single/dual-phase | QFN-68 |
| SY7M762J | Single/dual-phase | LQFP-128 |

Each version is orderable as bulk/tray (suffix B, for example SY7M713JBGEF) or on reel (SY7M713JGEF). All have 512 KB of flash. The remaining ordering numbers are SY7T733JBTIQ and SY7T733JTIQ, SY7M763JBGMF and SY7M763JGMF, SY7M712JBGEF and SY7M712JGEF, SY7T732JBTIQ and SY7T732JTIQ, and SY7M762JBGMF and SY7M762JGMF.

### Two cores and five ADCs

A **Cortex-M0 at up to 40 MHz** (the MPU) runs the meter firmware: communication, security, the display and housekeeping. A separate **64-bit compute engine (CE) at 40 MHz** does the metering arithmetic from its own RAM. The CE is fixed-function and not user programmable. Silergy supplies its code as a precompiled image, which the Cortex-M0 loads from flash into CE RAM at start-up. The two cores talk through shared RAM.

On the input side there are two kinds of ADC:

- **Three staring ADCs (ADCS)** for the current channels. Each can have an optional preamplifier of gain 7.9 V/V for small signals. The usable input range is ±125 mV peak with the preamp off and ±15.62 mV with it on.
- **One multiplexed ADC (ADCM)** for the three phase voltages and the neutral current, ±125 mV peak.

Current can come from CTs or Rogowski coils straight into the ADCS inputs, or from shunts through up to **three SY7M007 isolated remote ICs**. The remotes are capacitively coupled and powered through a transformer from two pulse-driver pins, RMT_DRV_H and DIO72/RMT_DRV_L. Receiver bias and input resistance are in the specification groups above.

From the samples the CE does DC-offset removal, per-sample voltage × current multiplication, a 90° shifter for VAR-hours, frequency and zero-crossing measurement, sag and swell monitoring, calibration scaling, temperature scaling, and energy accumulation, with squared sums for VRMS and IRMS. The usual accumulation interval is one second, after which the results are in shared RAM for the Cortex-M0 to read. The ADCS sample rate is programmable and goes up to 8 kHz.

### Memory and peripherals

- **Flash:** 512 KB, programmed and debugged over serial wire (SWD), not JTAG.
- **RAM:** the datasheet gives the total three different ways (see Datasheet notes). The functional description names 24 KB of SRAM dedicated to the MPU, another 24 KB shared by the MPU, a 512-byte SPI safe-mode region and the crypto hardware, 16 KB of CE code RAM shared with the MPU, 8 KB of CE data RAM, and 16 KB of non-volatile RAM on VBAT_RTC, plus 128 bytes of separate NV-RAM.
- **Serial:** six UARTs (UART0 and UART3 work with 9-bit framing, UART3 has an optional optical encoder and IrDA decoder), two SPI masters (SPI M0 can also be I2C or µWire), one SPI slave on the 5 V-tolerant pins SEG17 to SEG20, and a separate I2C master.
- **Timers and outputs:** two generic timers, two dual-input timers, four PWM outputs (DIO-SEG16/PWM0, DIO-SEG25/PWM1, DIO-SEG26/PWM2 and DIO-SEG54/PWM3) up to 2.5 MHz, and the two remote-drive pins.
- **Security:** AES 128/192/256, SHA-2 256/384/512, P-256/P-384 elliptic curve and a 32-bit true random number generator. The Hardware Reference Manual has the details, and we do not have it.
- **Reset and watchdog:** an on-chip power-on reset watches VDD, so no external reset circuit is needed. The watchdog cannot be disabled by code.
- **Clock:** one 32.768 kHz crystal feeds a PLL that makes all operating clocks. An internal RC oscillator trimmed to 32 kHz takes over if the crystal fails.
- **RTC:** weekday, date, month, year, hours, minutes, seconds, an 8-bit sub-second register (1/256 s), an alarm, a monotonic output that never steps backwards, and third-order temperature compensation from the on-chip sensor.
- **LCD:** up to 61 segment pins and 8 commons on the LQFP-100 (COM6/SEG21 and COM7/SEG22 are shared), LCD memory of 8 KB, automatic blinking on SEG2 and SEG3, up to 15 pages stepped by DMA at intervals up to 32 s, and an LCD supply from the DAC, a fixed 3.3 V or the VLCD pin. A charge pump can make +5 V on VLCD.
- **Analog extras:** a buffered, chopped reference with temperature compensation in the CE, a die temperature sensor, and a battery monitor with a de-passivation load. The temperature sensor's factory reading (fuse_temp22) is not accurate, so average several readings at meter calibration and store the result as stempCAL.

### Power modes

| Mode | Powered from | What runs |
| --- | --- | --- |
| Mission (MSN) | V3P3SYS and V3P3A, 3.0 V to 3.6 V | Everything |
| Brownout (BRN) | VBAT, once the V3P3SYS comparators trip; lasts until VBAT falls below 2.5 V | Metrology and the Cortex-M0, at full speed until firmware slows the clock or stops the ADCs. The switch is automatic |
| LCD-ONLY | VBAT, V3P3SYS or an external VLCD supply | The LCD only. RAM stays powered so up to 15 LCD images can be stepped without the MPU. The Cortex-M0 and analog parts are off. Commanded by the MPU |
| Sleep (SLP) | VBAT_RTC | RTC and non-volatile memory only (plus the LCD domain if LCD-ONLY is chosen). Only a wake event leaves it. Commanded by the MPU |

The datasheet says five operational modes and lists four; the fifth does not appear in the text we read. Wake sources are the timer, UART0 RX, pushbutton and wake pins, a comparator on WAKE_COMP, and temperature limits. Wake pins, DIO72 and RMT_DRV_H must be driven high or low in SLP and LCD-ONLY modes or they leak.

### Power pins

| Pin | What it is |
| --- | --- |
| V3P3SYS | Primary digital supply, 3.0 V to 3.6 V. Usually the same rail as V3P3A but bypassed separately |
| V3P3A | Primary analog supply: ADCs, comparators and the reference with its buffer |
| VBAT | Battery for brownout mode. Takes over when V3P3SYS falls below its threshold |
| VBAT_RTC | Battery for the RTC and non-volatile memory |
| V3P3RTC | Bypass point for the non-volatile domain. Never loaded |
| V3P3D | Output of an internal switch that picks V3P3SYS or VBAT. Always bypass it and never use it to drive external loads |
| VLCD | Usually a bypass point for the LCD supply. It can also be an input for an external LCD voltage |
| VDD | Bypass point for the supply of the internal flash |

### Battery connection options

| VBAT pin | VBAT_RTC pin | BRN | SLP | Result |
| --- | --- | --- | --- | --- |
| Battery 1 | Battery 2 | Supported | Supported | The RTC and NV-RAM stay up on battery 2 when battery 1 is flat and the board supply is down |
| Battery | Same battery | Supported | Supported | BRN on VBAT, SLP on VBAT_RTC. The RTC and NV-RAM are lost when the battery is flat and the board supply is down |
| V3P3SYS | Battery | Not supported | Supported | RTC and NV-RAM kept by the battery. No BRN when the board supply is down |
| Battery | V3P3SYS | Supported | Not supported | RTC and NV-RAM are not kept when the board supply is down |
| V3P3SYS | V3P3SYS | None | None | No battery. Typical for a panel meter |

### Unused pins

| Pin type | If unused |
| --- | --- |
| DIO-SEG, DIO-COM, RMT_DRIVE_H | GND or V3P3, direct or through a resistor, configured as input. They can instead be outputs driven low or high |
| DIO71/SWDIO, DIO70/SWCLK | GND. The programming pins are inactive while TEST is low |
| MUX_ADC6, VA, VB, VC | GND |
| RST | GND, direct or through a pull-down. A production meter does not usually have a pushbutton on it |
| TEST | GND, direct or through a pull-down |
| WAKE_COMP | GND, and clear the ew_wcomp bit in SYS_WAKE |
| UART wake pins (RX0, RX1) | V3P3, configured as DIO with the wake bit cleared in SYS_WAKE |
| Pushbutton wake pins (WAKE0 to WAKE3) | GND, same SYS_WAKE step. In SLP and LCD-ONLY they must be at a level to prevent leakage |

### Pinout

The table is the datasheet's pin table (pages 9 to 11), in its order, with the four pin-number columns for LQFP-100, LQFP-128, QFN-68 poly-phase and QFN-68 single/dual-phase. A dash means the pin does not exist in that package. The datasheet marks a few pins (†) as functional on poly-phase parts only.

| 100 | 128 | 68 PP | 68 SP | Pin name | Functions |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | - | - | DIO-SEG26/PWM2 | GPIO26 · SEG26 · PWM2 |
| 2 | 2 | 68 | 68 | DIO-SEG25/PWM1 | GPIO25 · SEG25 · PWM1 |
| 3 | 3 | 1 | 1 | DIO-SEG24/WPULSE | GPIO24 · SEG24 · WPULSE |
| 4 | 4 | 2 | 2 | DIO-SEG23/VPULSE | GPIO23 · SEG23 · VPULSE |
| 5 | 5 | - | - | DIO-SEG22/COM7 | GPIO22 · SEG22 · COM7 |
| 6 | 6 | - | - | DIO-SEG21/COM6 | GPIO21 · SEG21 · COM6 |
| 7 | 7 | 3 | 3 | DIO69/COM5 | GPIO69 · COM5 |
| 8 | 8 | 4 | 4 | DIO68/COM4 | GPIO68 · COM4 |
| 9 | 9 | 5 | 5 | DIO67/COM3 | GPIO67 · COM3 |
| 10 | 10 | 6 | 6 | DIO66/COM2 | GPIO66 · COM2 |
| 11 | 11 | 7 | 7 | DIO65/COM1 | GPIO65 · COM1 |
| 12 | 12 | 8 | 8 | DIO64/COM0 | GPIO64 · COM0 |
| - | 13 | - | - | DIO-SEG85 | GPIO85 · SEG85 |
| - | 14 | - | - | DIO-SEG84 | GPIO84 · SEG84 |
| - | 15 | - | - | DIO-SEG83 | GPIO83 · SEG83 |
| - | 16 | - | - | DIO-SEG82 | GPIO82 · SEG82 |
| - | 17 | - | - | DIO-SEG81 | GPIO81 · SEG81 |
| - | 18 | - | - | N/C | No connection |
| 13 | 19 | 9 | 9 | VDD | Bypass point for the flash supply (1.0 µF to ground) |
| 14 | 20 | 10 | 10 | DIO-SEG20/SPI_S0_CLK | GPIO20 · SEG20 · SPI_S0_CLK |
| 15 | 21 | 11 | 11 | DIO-SEG19/SPI_S0_MISO | GPIO19 · SEG19 · SPI_S0_MISO |
| 16 | 22 | 12 | 12 | DIO-SEG18/SPI_S0_MOSI | GPIO18 · SEG18 · SPI_S0_MOSI |
| 17 | 23 | 13 | 13 | DIO-SEG17/SPI_S0_CSB | GPIO17 · SEG17 · SPI_S0_CSB |
| 18 | 24 | - | - | DIO-SEG16/PWM0 | GPIO16 · SEG16 · PWM0 |
| 19 | 25 | 14 | 14 | DIO-SEG15/SPI_M1_CLK | GPIO15 · SEG15 · SPI_M1_CLK |
| 20 | 26 | 15 | 15 | DIO-SEG14/SPI_M1_MISO | GPIO14 · SEG14 · SPI_M1_MISO |
| 21 | 27 | 16 | 16 | DIO-SEG13/SPI_M1_MOSI | GPIO13 · SEG13 · SPI_M1_MOSI |
| 22 | 28 | - | - | DIO-SEG12/SPI_M1_CS | GPIO12 · SEG12 · SPI_M1_CS |
| 23 | 29 | - | - | DIO-SEG11/SPI_M0_CLK/TX4 | GPIO11 · SEG11 · SPI_M0_CLK · TX4 |
| 24 | 30 | 17 | 17 | DIO-SEG10/SPI_M0_MISO/(RX4) | GPIO10 · SEG10 · SPI_M0_MISO · (RX4) |
| 25 | 31 | 18 | 18 | DIO-SEG9/SPI_M0_MOSI/TX5 | GPIO9 · SEG9 · SPI_M0_MOSI · TX5 |
| - | 32 | - | - | DIO-SEG80 | GPIO80 · SEG80 |
| - | 33 | - | - | DIO-SEG79 | GPIO79 · SEG79 |
| - | 34 | - | - | DIO-SEG78 | GPIO78 · SEG78 |
| - | 35 | - | - | DIO-SEG77 | GPIO77 · SEG77 |
| - | 36 | - | - | DIO-SEG76 | GPIO76 · SEG76 |
| - | 37 | - | - | DIO-SEG75 | GPIO75 · SEG75 |
| - | 38 | - | - | DIO-SEG74 | GPIO74 · SEG74 |
| 26 | 39 | 19 | 19 | DIO-SEG8/SPI_M0_CS/RX5 | GPIO8 · SEG8 · SPI_M0_CS · RX5 |
| 27 | 40 | 20 | 20 | DIO-SEG7/RX3_OPT | GPIO7 · SEG7 · RX3 · IrDA_RX |
| 28 | 41 | 21 | 21 | DIO-SEG6/TX3_OPT | GPIO6 · SEG6 · TX3 · OPT_TX |
| 29 | 42 | 22 | 22 | DIO5/TMUX1 | GPIO5 · TMUX1 |
| 30 | 43 | 23 | 23 | DIO4/TMUX0 | GPIO4 · TMUX0 |
| 31 | 44 | 24 | 24 | DIO-SEG3/I2C_CLK/BLINKB | GPIO3 · SEG3/BLINKB · I2C_CLK |
| 32 | 45 | 25 | 25 | DIO-SEG2/I2C_DATA/BLINKA | GPIO2 · SEG2/BLINKA · I2C_DATA |
| 33 | 46 | - | - | DIO-SEG1/TMR1 | GPIO1 · SEG1 · TMR1 |
| 34 | 47 | 26 | 26 | DIO-SEG0/TMR0 | GPIO0 · SEG0 · TMR0 |
| 35 | 48 | 27 | 27 | GNDD | Digital ground |
| 36 | 49 | 28 | 28 | DIO72/RMT_DRIVE_L | DIO72 · RMT_DRIVE_L |
| 37 | 50 | 29 | 29 | RMT_DRIVE_H | Not for DIO use · RMT_DRIVE_H |
| - | 51 | - | - | V3P3RMT | Digital supply for the remote system (128-pin only); connect to V3P3SYS (pin 52) |
| 38 | 52 | 30 | 30 | V3P3SYS | Digital supply; connect to V3P3A |
| 39 | 53 | 31 | 31 | DIO71/SWDIO | GPIO71 · SWDIO |
| 40 | 54 | 32 | 32 | DIO70/SWCLK | GPIO70 · SWCLK |
| 41 | 55 | - | - | DIO-SEG63 | GPIO63 · SEG63 |
| 42 | 56 | 33 | 33 | DIO-SEG62 | GPIO62 · SEG62 |
| 43 | 57 | - | - | DIO-SEG61/1_SEC_PLS | GPIO61 · SEG61 · 1_SEC_PLS |
| 44 | 58 | - | - | DIO-SEG60 | GPIO60 · SEG60 |
| 45 | 59 | - | - | DIO-SEG59 | GPIO59 · SEG59 |
| 46 | 60 | - | - | DIO-SEG58 | GPIO58 · SEG58 |
| 47 | 61 | - | - | DIO-SEG57 | GPIO57 · SEG57 |
| 48 | 62 | - | - | DIO-SEG56 | GPIO56 · SEG56 |
| 49 | 63 | - | - | DIO-SEG55 | GPIO55 · SEG55 |
| 50 | 64 | 34 | 34 | V3P3D | DIO bypass point (100 nF to ground). Not for powering external parts; in battery modes the capacitor sets the slew rate |
| 51 | 65 | 35 | 35 | DIO-SEG54/PWM3 | GPIO54 · SEG54 · PWM3 |
| 52 | 66 | 36 | 36 | DIO-SEG53/RX2 | GPIO53 · SEG53 · RX2 |
| 53 | 67 | 37 | 37 | DIO-SEG52/TX2 | GPIO52 · SEG52 · TX2 |
| 54 | 68 | - | 38 | DIO-SEG51 | GPIO51 · SEG51 |
| 55 | 69 | - | 39 | DIO-SEG50 | GPIO50 · SEG50 |
| 56 | 70 | - | - | DIO-SEG49 | GPIO49 · SEG49 |
| 57 | 71 | - | - | DIO-SEG48 | GPIO48 · SEG48 |
| 58 | 72 | - | - | DIO-SEG47 | GPIO47 · SEG47 |
| 59 | 73 | - | - | DIO-SEG46 | GPIO46 · SEG46 |
| 60 | 74 | - | - | DIO-SEG45 | GPIO45 · SEG45 |
| 61 | 75 | - | - | DIO-SEG44 | GPIO44 · SEG44 |
| - | 76 | - | - | DIO-SEG92 | GPIO92 · SEG92 |
| - | 77 | - | - | DIO-SEG91 | GPIO91 · SEG91 |
| - | 78 | - | - | DIO-SEG90 | GPIO90 · SEG90 |
| - | 79–82 | - | - | N/C | No connection |
| 62 | 83 | 38 | 40 | MUX_ADC6 | Extra input to the multiplexed ADC |
| 63 | 84 | 39 | - | ICP/RMT2_P | ICP · RMT2_P |
| 64 | 85 | 40 | - | ICN/RMT2_N | ICN · RMT2_N |
| 65 | 86 | 41 | 41 | IBP/RMT1_P | IBP · RMT1_P · MUX_ADC3 |
| 66 | 87 | 42 | 42 | IBN/RMT1_N | IBN · RMT1_N · MUX_ADC2 |
| 67 | 88 | 43 | 43 | IAP/RMT0_P | IAP · RMT0_P · MUX_ADC1 |
| 68 | 89 | 44 | 44 | IAN/RMT0_N | IAN · RMT0_N · MUX_ADC0 |
| 69 | 90 | 45 | 45 | V3P3A | Analog supply; connect to V3P3SYS |
| 70 | 91 | 46 | - | IN | Neutral current input (poly-phase parts only) |
| 71 | 92 | 47 | - | VC | Divided phase voltage C / L3 (poly-phase parts only) |
| 72 | 93 | 48 | 48 | VB | Divided phase voltage B / L2 |
| 73 | 94 | 49 | 49 | VA | Divided phase voltage A / L1 |
| 74 | 95 | 50 | 50 | GNDA | Analog ground |
| 75 | 96 | 51 | 51 | XOUT | Crystal oscillator output, 32.768 kHz |
| 76 | 97 | 52 | 52 | XIN | Crystal oscillator input, 32.768 kHz |
| 77 | 98 | 53 | 53 | VBAT | Battery supply for brownout mode: battery positive, or V3P3SYS |
| 78 | 99 | 54 | 54 | VBAT_RTC | Battery supply for the RTC and NV-RAM: battery positive, or V3P3SYS |
| 79 | 100 | 55 | 55 | VLCD | LCD voltage bypass point (100 nF); an external LCD supply may be applied |
| 80 | 101 | 56 | 56 | V3P3RTC | Bypass point for the non-volatile supply (1.0 µF to ground) |
| 81 | 102 | 57 | 57 | RST | Reset, active high; may go to a pushbutton |
| 82 | 103 | 58 | 58 | TEST | Test and program mode, active high: high to program or attach the emulator, low in normal operation |
| 83 | 104 | - | - | WAKE_COMP | Wake comparator input |
| 84 | 105 | 59 | 59 | DIO-SEG43/WAKE0 | GPIO43 · SEG43 · WAKE0 |
| 85 | 106 | 60 | 60 | DIO-SEG42/WAKE1 | GPIO42 · SEG42 · WAKE1 |
| 86 | 107 | 61 | 61 | DIO-SEG41/WAKE2 | GPIO41 · SEG41 · WAKE2 |
| 87 | 108 | 62 | 62 | DIO-SEG40/WAKE3 | GPIO40 · SEG40 · WAKE3 |
| 88 | 109 | 63 | 63 | DIO-SEG39/RX0 | GPIO39 · SEG39 · RX0 |
| 89 | 110 | 64 | 64 | DIO-SEG38/RX1 | GPIO38 · SEG38 · RX1 |
| 90 | 111 | 65 | 65 | DIO-SEG37/TX0 | GPIO37 · SEG37 · TX0 |
| 91 | 112 | 66 | 66 | DIO-SEG36/TX1 | GPIO36 · SEG36 · TX1 |
| - | 113–115 | - | - | N/C | No connection |
| - | 116 | - | - | DIO-SEG89 | GPIO89 · SEG89 |
| - | 117 | - | - | DIO-SEG88 | GPIO88 · SEG88 |
| - | 118 | - | - | DIO-SEG87 | GPIO87 · SEG87 |
| - | 119 | - | - | DIO-SEG86 | GPIO86 · SEG86 |
| 92 | 120 | 67 | 67 | DIO-SEG35 | GPIO35 · SEG35 |
| 93 | 121 | - | - | DIO-SEG34 | GPIO34 · SEG34 |
| 94 | 122 | - | - | DIO-SEG33 | GPIO33 · SEG33 |
| 95 | 123 | - | - | DIO-SEG32 | GPIO32 · SEG32 |
| 96 | 124 | - | - | DIO-SEG31 | GPIO31 · SEG31 |
| 97 | 125 | - | - | DIO-SEG30 | GPIO30 · SEG30 |
| 98 | 126 | - | - | DIO-SEG29 | GPIO29 · SEG29 |
| 99 | 127 | - | - | DIO-SEG28 | GPIO28 · SEG28 |
| 100 | 128 | - | - | DIO-SEG27 | GPIO27 · SEG27 |

## Example application

The datasheet has **no application schematic**. Pages 3, 35 and 36 hold block diagrams: a polyphase shunt system with SY7M007 remotes, with resistor dividers on the voltages, and the typical application circuit for the SY7M713J. They show sensors and blocks, not component values. The only passives the datasheet specifies are in its "Recommended External Components" table, and the drawing below is those components wired to the SY7M713J (LQFP-100) as the pin descriptions and unused-pin table say. **The drawing is ours.** It shows the supporting circuit, not the sensor inputs.

### Supporting circuit

![The SY7M713J supporting circuit as we drew it from the Recommended External Components table. V3P3A and V3P3SYS both connect to a 3.3 V supply, each with a 1.0 µF capacitor to ground. V3P3D has 0.1 µF (10 µF if low-power modes are used) and is not for loads. VDD has 1.0 µF, V3P3RTC has 1.0 µF and VLCD has 0.1 µF. A 32.768 kHz crystal sits across XIN and XOUT, with 22 pF from XIN and 33 pF from XOUT to ground. Battery BT1 connects to VBAT and BT2 to VBAT_RTC. RST, TEST and WAKE_COMP are tied to ground, and GNDA and GNDD are joined.](schematic:sy7m7xxj-schematic.svg)

| Ref | Part | Description | Maker |
| --- | --- | --- | --- |
| U1 | SY7M713JGEF | Poly-phase metering SoC, LQFP-100 (reel; our designator) | Silergy |
| CV3P3A | Not given | 1.0 µF ±30%, V3P3A to ground, analog supply bypass | Not given |
| CV3P3S | Not given | 1.0 µF ±30%, V3P3SYS to ground, digital supply bypass | Not given |
| CV3P3D | Not given | 0.1 µF ±20% on V3P3D, or 10 µF if low-power modes are used | Not given |
| CVDD | Not given | 1.0 µF ±20%, VDD to ground, core supply bypass | Not given |
| CVRTC | Not given | 1.0 µF ±30%, V3P3RTC to ground, non-volatile supply bypass | Not given |
| CVLCD | Not given | 0.1 µF ±20%, VLCD to ground, LCD supply bypass | Not given |
| XTAL | Not given | 32.768 kHz crystal, XIN to XOUT | Not given |
| CXS | Not given | 22 pF ±10%, XIN to ground | Not given |
| CXL | Not given | 33 pF ±10%, XOUT to ground | Not given |
| BT1, BT2 | Not given | Battery on VBAT (brownout) and battery on VBAT_RTC (sleep, RTC). Our designators. Pick the connection from the battery table above | Not given |

The LQFP-128 parts add a V3P3RMT supply for the remote drivers, and the datasheet lists a 0.1 µF ±10% bypass on it (CV3P3SRMT, 128-LQFP only). The table also lists 100 kΩ pull-downs (RSPIPD) on DIO17 to DIO20 if those pins are not used for SPI or to drive external components.

> **About the source.** The component values and tolerances are from the "Recommended External Components" table on page 16 of the datasheet, Rev 1.4. The wiring is our reading of the pin descriptions, the unused-pin table and the battery table. The datasheet does not draw this circuit, no part numbers are given for any passive, and the crystal load capacitors are said to depend on the crystal and the board, with 4 pF of parasitic capacitance assumed. The SY7M007 remotes, the shunts, the CT or Rogowski inputs and the voltage dividers are not drawn.

### Worked example: first-pass budgets for a meter

The figures come from the datasheet's specification tables and are redone in the Recommended components tables above.

1. **Mission-mode supply power.** At 3.3 V, V3P3SYS (5.1 mA) plus V3P3A (5.0 mA) is 10.1 mA typical, or about 33 mW (calculated). The maximum rows add up to 13.1 mA, which is 47 mW at 3.6 V (calculated). Raising the MPU from 10.224 MHz to 40 MHz at the datasheet's 138 µA per MHz adds about 4.1 mA (calculated), so a full-speed meter is closer to 14 mA typical.
2. **Sleep and battery life.** With a 100 mAh cell on VBAT_RTC alone and VBAT at 0 V, the typical 1.2 µA runs for about 9.5 years and the 2.7 µA maximum for about 4.2 years (calculated, ignoring self-discharge). With both pins on one cell the sleep current is 4 µA typical and 6 µA maximum, which is 2.9 and 1.9 years. The title page says 1 µA, which matches neither row.
3. **Crystal load.** The datasheet suggests 22 pF and 33 pF with 4 pF of parasitic capacitance assumed. The two capacitors in series are 13.2 pF, and adding the 4 pF gives about 17.2 pF seen by the crystal (calculated, our arithmetic, since the sheet gives no load formula). Compare that with the load capacitance on your crystal's own datasheet.
4. **V3P3D bypass.** The switch to the battery slews V3P3D at no more than 1 V/ms, which a 0.1 µF capacitor supports only at about 100 µA of load, a 1 µF capacitor at about 1 mA and a 10 µF capacitor at about 10 mA (calculated from I = C × dV/dt). That is why the table asks for 10 µF when low-power modes are used.
5. **Thermal.** A 125 °C junction limit at 85 °C ambient allows about 0.75 W in the LQFP-100, 0.99 W in the LQFP-128 and 1.33 W in the QFN-68 (calculated from θJA). A meter at 3.3 V and about 14 mA is nowhere near this.

### Typical signal chain

The datasheet's block diagrams show the sensors but give no values, so we only list what they show:

- **Shunt with SY7M007 remotes** (polyphase, page 35): a shunt in each phase and the neutral, each read by a remote, with the SY7M007s coupled to the SoC through the RMT_DRV_H and DIO72/RMT_DRV_L transformer drive. Resistor dividers on the voltages go to the ADCM inputs VA, VB and VC.
- **CT or Rogowski coil:** straight into the ADCS inputs IAP/IAN, IBP/IBN and ICP/ICN, with the preamp bit chosen for the signal size.

The plot on page 22, as we read it, shows the accuracy of a design with a 120 µΩ shunt. The Recommended components table for that shunt gives the signal at each current: 12.00 mV rms (16.97 mV peak) at 100 A, for example.

## Layout

The datasheet gives thermal resistance and package outlines (pages 37 to 40) but no land pattern that we found. Things it does say that bear on layout:

- **Bypass each supply separately.** V3P3A and V3P3SYS each get their own 1.0 µF, even when they are on the same rail. V3P3D, V3P3RTC, VDD and VLCD each get a bypass capacitor, and none of V3P3D, V3P3RTC or VDD may drive a load.
- **Grounds.** GNDA and GNDD are rated to differ by only ±0.1 V, so join them at one point. The pin table lists the ground pins for each package.
- **Crystal.** Keep CXS and CXL close to XIN and XOUT. The values depend on the crystal and the PCB parasitics, with 4 pF assumed.
- **Programming pins.** DIO70/SWCLK and DIO71/SWDIO are normally brought to a header if in-circuit flash programming is used. They are inactive while TEST is low.
- **Heat.** The QFN-68 has the lowest θJA of the three at 30.16 °C/W, and the LQFP-100 the highest at 53.26 °C/W (four-layer Silergy evaluation board, still air). Neither is a problem at the supply currents above.

Pin 1 is marked in the datasheet's top-view pin diagrams (pages 5 to 8), and we have not read off which corner it is for each package. This site has no KiCad symbol or footprint for this part yet.

## What the datasheet shows

Rev 1.4 (27 August 2025, 44 pages) has the features and ordering table, a typical application block diagram, pin diagrams for the three packages, the pin table, battery connection options, the unused-pin table, absolute maximum and thermal ratings, recommended operating conditions and external components, the electrical specification tables (supply currents, power-fault comparators, digital I/O, both ADCs, reference, temperature sensor, oscillators, remote interface, serial ports, LCD, flash), the functional description, the application block diagrams, package outlines and markings, and the revision history. It does not contain a register map, which is in the Hardware Reference Manual, and it does not contain the CE code details, which are in the CE Code Reference Manual. We have not seen either.

## Things to watch

- **Supply limits.** V3P3SYS and V3P3A are 3.0 V to 3.6 V in mission mode, with 3.6 V as the absolute maximum. VBAT and VBAT_RTC may go to 3.8 V. VBAT must stay above 2.5 V for brownout mode and VBAT_RTC above 2.0 V for sleep and LCD-only.
- **Do not let the supply fall faster than 100 mV per ms** if battery modes are used. A faster fall prevents the switch-over from V3P3A and V3P3SYS to VBAT.
- **The device is not guaranteed outside its operating conditions.** The ratings table is for stress only.
- **V3P3D is not an output for loads.** Bypass it and do not use it to supply anything. The datasheet suggests 10 µF if low-power modes are used.
- **Drive LEDs and relay coils low, not high.** The text says external components should be pulled low by a DIO pin.
- **Wake pins must not float in SLP and LCD-ONLY modes.** Tie them, DIO72 and RMT_DRV_H high or low to prevent leakage.
- **DIO16 to DIO20 are 5 V tolerant** but have no internal pull-up or pull-down. The table suggests 100 kΩ pull-downs if the pins are unused for SPI or to drive other parts.
- **Input thresholds depend on the pin.** DIO39 to DIO43, RST and TEST are referenced to V3P3RTC and the rest to V3P3D.
- **RST and TEST have internal pull-downs** of about 160 µA typical, so a pull-down resistor to ground is optional and a pushbutton to a supply will draw current.
- **The ADCS preamp rows are not tested in production.**
- **Several figures are not tested in production**, among them temperature-sensor error, crystal oscillator stability, ADC gain and drift terms, SPI slave timing and flash timing. They are marked in the specification groups above.
- **The die temperature reading needs your own reference.** The factory value is not accurate, so average several readings at calibration.
- **We have no KiCad symbol, footprint or package drawings** for this family.

## Datasheet notes

- **Sleep current is stated two ways.** The title page says 1 µA in sleep mode. The electrical table gives 1.2 µA typical and 2.7 µA maximum on VBAT_RTC with VBAT = 0 V, and 4 µA typical and 6 µA maximum with both pins on one battery.
- **RAM is stated three ways.** The title page lists 76 KB (48 KB for the MPU and crypto, 16 KB CE code, 8 KB CE data, 4 KB LCD). The functional description lists 24 KB plus 24 KB shared for the MPU, 16 KB of CE code RAM and 8 KB of CE data RAM, with 16 KB of NV-RAM and 8 KB of LCD memory.
- **The title page and the text count LCD pages differently.** The title page says "6 pages" in one bullet and "15 LCD pages" in the next. The functional description says 15.
- **LCD segment count.** Revision 1.3 says it corrected the LQFP-100 LCD pins to 71 on the title page, but the title page now says 61 segment pins and up to 71 GPIO, which is what the functional description says for the SY7M713J.
- **The compute engine is 64-bit,** except where the functional text calls it a 32-bit core in one place.
- **Five modes, four listed.** The power-modes section says five operational modes and describes four.
- **The multiplexed ADC and staring ADC LSB tables do not exactly match their formulas.** The printed LSB values imply a reference of about 1.212 V, against the 1.197 V typical in the electrical table, and the 6554 Hz staring-ADC row (75.59 nV) is out of line with its neighbours (about 72.6 nV expected from the formula). The Recommended components tables show the comparison (calculated).
- **The shunt accuracy plot goes outside ±0.1%** at the ends of its range, though the title page promises ±0.1% over a 5,000 to 1 range in CT mode. A shunt is not CT mode.
- **Unit typos.** The V3P3D slew limit is printed as V/mV, and the thermal resistance units are printed with a garbled symbol (°C/W is meant). The VDD absolute maximum current shows TBD.
- **Revision history.** Rev 1.0 (December 2024) is the first release. Rev 1.1 (January 2025) removes "polyphase systems" from the title, adjusts the temperature-sensor accuracy, adds pin-out diagrams for the SY7T732J, and updates the pin descriptions, the LCD DAC table and the TC1/TC2 values. Rev 1.2 (March 2025) updates VREF deviation over temperature and the SPI master clock speeds, and corrects a VLCD IOH condition. Rev 1.3 (May 2025) corrects TC2S and the LCD pin count and updates the 68-pin diagrams. Rev 1.4 (27 August 2025) corrects the DIO4/TMUX0 and DIO5/TMUX1 descriptions, updates thermal ratings and package markings. The history names SY7M733J and SY7M732J, which are not in the ordering table; the table has SY7T733J and SY7T732J.
- **The datasheet states no lifecycle status.** The status on this page is "active" because Silergy's product page lists the SY7M713J as Production. We did not find the status of the other five versions.
- **Related parts.** The [SY7M212H / SY7T231H](site:parts/silergy/sy7m212h-sy7t231h/) is the earlier dual-phase Teridian SoC in LQFP-100 and QFN-68, with its own datasheet. The [SY7T6xx](site:parts/silergy/sy7t6xx/) is another Silergy metering part. The datasheet says the SY7M713J is pin-to-pin compatible with the SY7M213H, which we do not have a page for.
- **Where the datasheet comes from.** The link on this page is the download link on Silergy's product page for the SY7M713J (we did not open it in full). The file we read is Rev 1.4 (PDS_SY7M7xxJ, 44 pages).
