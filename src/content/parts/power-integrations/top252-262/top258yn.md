---
manufacturer: Power Integrations
family: TOP252-262
part: TOP258YN
category: ac-dc-controller
summary: '700 V off-line flyback switcher, TO-220-7C, 4.30 A current limit, 1.7 Ω RDS(ON), line UV/OV sense, 66 or 132 kHz. Table 1: 105 W adapter, 195 W open frame at 230 VAC.'
abstract: The TOP258YN is the TOP258 off-line switcher of the TOPSwitch-HX family in the Y package (TO-220-7C), from the TOP252-262 datasheet. It puts a 700 V power MOSFET (1.7 Ω typical), its gate driver, PWM control, a start-up current source from the drain, line sensing, a programmable current limit (4.30 A typical) and fault protection in one package, so the supply needs only the transformer, an output stage and an optocoupler feedback loop. Line undervoltage and overvoltage detection and the current limit are set with resistors, output overvoltage protection can latch or not, and four operating modes keep efficiency up at light load. Table 1 rates it at 105 W in a sealed adapter and 195 W open frame at 230 VAC, and 70 W and 148 W over 85-265 VAC. The datasheet's design example, Figure 42, is a 150 W, 19 V supply from 250 to 380 VDC with a full parts list, and it is redrawn on this page. This page is built from the full 50-page Rev. N datasheet (December 2022); the E-package twin of this part, and the P, G, M and L versions, are covered by the same datasheet and listed in a table.
status: unknown
packages:
- TO-220-7C
specs:
  fsw_khz: 66 or 132
  topology: 'Off-line flyback switcher: 700 V power MOSFET, PWM control, start-up current source, line sense and fault protection in one package'
  extra:
  - label: Adapter rating, 230 VAC ±15%
    value: 105 W adapter and 195 W open frame (Table 1, TOP258EN/YN/EG). Note 4 adds 110/115 VAC with a doubler
  - label: Adapter rating, 85-265 VAC
    value: 70 W adapter and 148 W open frame (Table 1)
  - label: Drain breakdown
    value: 700 V minimum (BVDSS, TJ = 25 °C); absolute maximum drain peak voltage 700 V
  - label: Switching frequency
    value: 132 kHz (119 to 145 kHz) with F tied to SOURCE; 66 kHz (59.4 to 72.6 kHz) with F tied to CONTROL. Jitter ±5 kHz at 132 kHz, ±2.5 kHz at 66 kHz
  - label: Current limit
    value: 4.30 A typical (3.999 to 4.601 A) for the YN, at TJ = 25 °C. Adjustable down to 30% with a resistor on X
  - label: Absolute maximum drain peak current
    value: 6.88 A (TOP258)
  - label: MOSFET on-resistance
    value: 1.7 Ω typical, 1.95 Ω maximum at TJ = 25 °C; 2.5 Ω typical, 2.90 Ω maximum at TJ = 100 °C
  - label: Maximum duty cycle
    value: 78% typical (75 to 83%); falls with line voltage when the V pin is used
  - label: Line sense
    value: 'Undervoltage 25 µA and overvoltage 112 µA typical pin currents on the V pin. RLS = 4 MΩ: 102.8 VDC and 451 VDC'
  - label: Start-up
    value: Operates from an 18 V DRAIN supply minimum (TJ ≤ 85 °C, see Note E in the datasheet)
  - label: Thermal shutdown
    value: 142 °C typical (135 to 150 °C), 75 °C hysteresis, automatic recovery
  - label: Thermal resistance, Y package
    value: 80 °C/W junction to ambient free-standing; 2 °C/W junction to case, at the back of the tab
  - label: Lifecycle note in the datasheet
    value: M-package and L-package TOP258 parts are marked obsolete per PCN-20112 (Table 1, note 7); the Y package is not marked
features:
- Multi-mode operation (full-frequency PWM, variable-frequency, low-frequency PWM and multi-cycle modulation) maximizes efficiency at all loads
- TO-220-7C package with the tab connected to SOURCE and a 2 °C/W junction-to-case thermal impedance
- Output overvoltage protection programmable as latching or non-latching, with fast AC reset, for primary or secondary sensing
- Line undervoltage detection prevents turn-off glitches, and line overvoltage shutdown extends the surge limit
- Accurate programmable current limit, adjustable from 100% down to 30%, and dual-slope line feed-forward for ripple rejection
- 132 kHz with a 66 kHz option for video on the TOP254Y to TOP258Y, and frequency jitter to cut EMI filter cost
- Auto-restart delivers under 3% of maximum power in short-circuit and open-loop faults
- Hysteretic thermal shutdown that recovers by itself, and a 17 ms integrated soft start
- No-load consumption under 200 mW at 230 VAC; over 600 mW of output for 1 W of input at 110 VAC
- Extended creepage from DRAIN to all other pins
spec_groups:
- title: Absolute maximum ratings (page 32)
  items:
  - label: DRAIN peak voltage
    value: -0.3 to 700 V
  - label: DRAIN peak current
    value: 6.88 A (TOP258)
  - label: CONTROL voltage and current
    value: -0.3 to 9 V, 100 mA
  - label: VOLTAGE MONITOR and FREQUENCY pin voltage
    value: -0.3 to 9 V
  - label: CURRENT LIMIT pin voltage
    value: -0.3 to 4.5 V
  - label: Storage temperature
    value: -65 to 150 °C
  - label: Operating junction temperature
    value: -40 to 150 °C
  - label: Lead temperature
    value: 260 °C, 1/16 in. from the case for 5 s
  - label: How the ratings apply
    value: Each maximum may be applied one at a time without permanent damage; the test conditions elsewhere are SOURCE = 0 V and TJ = -40 to 125 °C
- title: Thermal resistance, Y package (page 32)
  items:
  - label: Junction to ambient
    value: 80 °C/W free-standing with no heatsink
  - label: Junction to case
    value: 2 °C/W, measured at the back of the tab
- title: Oscillator, PWM and control (pages 32 and 33)
  items:
  - label: Switching frequency, F tied to SOURCE (TOP254-258Y)
    value: 119 / 132 / 145 kHz (min / typ / max) at TJ = 25 °C
  - label: Switching frequency, F tied to CONTROL
    value: 59.4 / 66 / 72.6 kHz
  - label: Frequency jitter
    value: ±5 kHz at 132 kHz, ±2.5 kHz at 66 kHz, modulation rate 250 Hz
  - label: Maximum duty cycle DCMAX
    value: 75 / 78 / 83 % with the V pin at 0 V; 30% (min) with IV = 95 µA
  - label: Soft-start time
    value: 17 ms typical at TJ = 25 °C
  - label: PWM gain (TOP256 to TOP258)
    value: -27 / -22 / -17 %/mA
  - label: External bias current IB (TOP256 to TOP258)
    value: 1.0 / 1.6 / 2.2 mA at 66 kHz; 1.3 / 1.9 / 2.5 mA at 132 kHz
  - label: CONTROL current at 0% duty cycle IC(OFF) (TOP256 to TOP258)
    value: 4.7 typ / 6.1 mA max at 66 kHz; 5.1 typ / 6.5 mA max at 132 kHz (no minimum printed)
  - label: PWM gain temperature drift
    value: -0.01 %/mA/°C typical
  - label: CONTROL pin dynamic impedance ZC
    value: 10 / 18 / 22 Ω at IC = 4 mA and TJ = 25 °C; drift 0.18 %/°C
  - label: CONTROL pin internal filter pole
    value: 7 kHz typical
  - label: kPS(UPPER), kPS(LOWER)
    value: 50 / 55 / 60 % and 25% typical, of the set current limit (characterization)
  - label: Multi-cycle modulation
    value: fMCM(MIN) 30 kHz typical, TMCM(MIN) 135 µs typical
- title: Auto-restart (page 33)
  items:
  - label: CONTROL pin charging current IC(CH)
    value: -5.0 / -3.5 / -1.0 mA at VC = 0 V; -3.0 / -1.8 / -0.6 mA at VC = 5 V
  - label: Auto-restart thresholds
    value: 5.8 V upper (typical); 4.5 / 4.8 / 5.1 V lower; hysteresis 0.8 V min, 1.0 V typ
  - label: Auto-restart duty cycle
    value: 2% typical, 4% maximum
  - label: Auto-restart frequency
    value: 0.5 Hz typical
- title: V and X pin thresholds (pages 33 and 34)
  items:
  - label: Line undervoltage threshold current IUV
    value: 22 / 25 / 27 µA, hysteresis 14 µA typical (TJ = 25 °C)
  - label: Line overvoltage threshold current IOV
    value: 107 / 112 / 117 µA, hysteresis 4 µA typical
  - label: Latching OVP threshold current IOV(LS)
    value: 269 / 336 / 403 µA
  - label: V pin reset voltage
    value: 0.8 / 1.0 / 1.6 V
  - label: Remote ON/OFF negative threshold current IREM(N)
    value: -35 / -27 / -20 µA, hysteresis 5 µA typical (X pin)
  - label: V pin short-circuit current
    value: 300 / 400 / 500 µA (pin tied to C)
  - label: X pin short-circuit current
    value: -260 / -200 / -140 µA in normal mode; -95 / -75 / -55 µA in auto-restart
  - label: V pin voltage, positive current
    value: 2.10 / 2.8 / 3.20 V at IUV; 2.83 / 3.0 / 3.25 V at IOV (TOP258 to TOP262; TOP252 to TOP257 print 2.79 / 3.0 / 3.21 V); hysteresis 0.2 V min, 0.5 V typ
  - label: X pin voltage, negative current
    value: 1.23 / 1.30 / 1.37 V at -50 µA; 1.15 / 1.22 / 1.29 V at -150 µA
  - label: DCMAX reduction onset current IV(DC)
    value: 18.9 / 22.0 / 24.2 µA (IC ≥ IB, TJ = 25 °C)
  - label: DCMAX reduction slope
    value: -1.0 %/µA between onset and 48 µA; -0.25 %/µA at 48 µA and above
  - label: Remote OFF DRAIN supply current
    value: 0.6 typical, 1.0 mA max with the X or V pin floating; 1.0 typical, 1.6 mA max with the V pin tied to CONTROL (VDRAIN = 150 V)
  - label: Remote ON delay and OFF setup time
    value: 3.0 µs at 66 kHz, 1.5 µs at 132 kHz typical (characterization)
  - label: FREQUENCY pin
    value: Threshold 2.9 V typical (characterization); input current 10 / 55 / 90 µA with VF = VC
- title: Circuit protection (pages 35 and 36)
  items:
  - label: Current limit ILIMIT, TOP258YN
    value: 3.999 / 4.30 / 4.601 A at TJ = 25 °C and di/dt = 890 mA/µs (printed together with the TOP258EN)
  - label: Initial current limit IINIT
    value: 0.70 × ILIMIT(MIN) minimum (characterization)
  - label: Power coefficient PCOEFF
    value: 0.9 × I²f / I²f / 1.2 × I²f A²kHz at IX ≤ -165 µA and ≤ -117 µA (TJ = 25 °C), where I²f = ILIMIT(TYP)² × fOSC
  - label: Leading edge blanking time, current limit delay
    value: 220 ns and 100 ns typical
  - label: Thermal shutdown temperature and hysteresis
    value: 135 / 142 / 150 °C, 75 °C typical
  - label: Power-up reset threshold VC(RESET)
    value: 1.75 / 3.0 / 4.25 V
- title: Output MOSFET and supply (pages 36 and 37)
  items:
  - label: ON-state resistance RDS(ON), TOP258
    value: 1.7 typ / 1.95 max Ω at TJ = 25 °C; 2.5 typ / 2.90 max Ω at TJ = 100 °C (ID = 500 mA)
  - label: DRAIN supply voltage
    value: 18 V (TJ ≤ 85 °C, note E) and 36 V, both printed as the minimum column
  - label: OFF-state drain leakage IDSS
    value: 470 µA maximum at VDS = 560 V, TJ = 125 °C, IC = 4 mA
  - label: Breakdown voltage BVDSS
    value: 700 V minimum at TJ = 25 °C
  - label: Rise and fall time
    value: 100 ns and 50 ns typical, in a typical flyback
  - label: CONTROL supply/discharge current ICD2
    value: 0.3 / 0.6 / 1.3 mA with the output MOSFET disabled
  - label: CONTROL supply/discharge current ICD1 (TOP256 to TOP258)
    value: 0.9 / 1.4 / 2.3 mA at 66 kHz; 1.1 / 1.6 / 2.5 mA at 132 kHz, output MOSFET enabled
design_tables:
- title: Y-package parts, TOP254 to TOP261
  note: The Y package in Table 1 and the parameter table, with the TOP258YN in the middle. Power is from Table 1 (adapter is the minimum continuous power in a sealed adapter at +50 °C, open frame the same in an open frame). ILIMIT is typical at TJ = 25 °C with the minimum to maximum range in brackets. RDS(ON) is typical / maximum at 25 °C. The last column is the absolute maximum DRAIN peak current. Table 1 prints the Y and E parts together. TOP262 is not offered in the Y package.
  columns:
  - Device
  - Pin 5
  - Frequency
  - 230 VAC adapter
  - 230 VAC open frame
  - 85-265 VAC adapter
  - 85-265 VAC open frame
  - ILIMIT (A)
  - RDS(ON) (Ω)
  - Drain peak abs max (A)
  rows:
  - - TOP254YN
    - F
    - 132 kHz (F to SOURCE) or 66 kHz (F to CONTROL)
    - 30 W
    - 62 W
    - 20 W
    - 43 W
    - 1.30 A (1.209 to 1.391)
    - 5.4 / 6.25
    - '2.08'
  - - TOP255YN
    - F
    - 132 kHz (F to SOURCE) or 66 kHz (F to CONTROL)
    - 40 W
    - 81 W
    - 26 W
    - 57 W
    - 1.70 A (1.581 to 1.819)
    - 4.1 / 4.70
    - '2.72'
  - - TOP256YN
    - F
    - 132 kHz (F to SOURCE) or 66 kHz (F to CONTROL)
    - 60 W
    - 119 W
    - 40 W
    - 86 W
    - 2.55 A (2.371 to 2.729)
    - 2.8 / 3.20
    - '4.08'
  - - TOP257YN
    - F
    - 132 kHz (F to SOURCE) or 66 kHz (F to CONTROL)
    - 85 W
    - 157 W
    - 55 W
    - 119 W
    - 3.40 A (3.162 to 3.638)
    - 2.0 / 2.30
    - '5.44'
  - - TOP258YN (this page)
    - F
    - 132 kHz (F to SOURCE) or 66 kHz (F to CONTROL)
    - 105 W
    - 195 W
    - 70 W
    - 148 W
    - 4.30 A (3.999 to 4.601)
    - 1.7 / 1.95
    - '6.88'
  - - TOP259YN
    - G
    - 66 kHz, fixed
    - 128 W
    - 238 W
    - 80 W
    - 171 W
    - 5.15 A (4.790 to 5.511)
    - 1.45 / 1.70
    - '7.73'
  - - TOP260YN
    - G
    - 66 kHz, fixed
    - 147 W
    - 275 W
    - 93 W
    - 200 W
    - 6.00 A (5.580 to 6.420)
    - 1.20 / 1.40
    - '9.00'
  - - TOP261YN
    - G
    - 66 kHz, fixed
    - 177 W
    - 333 W
    - 118 W
    - 254 W
    - 7.40 A (6.882 to 7.918)
    - 1.05 / 1.20
    - '11.10'
- title: Line sense thresholds against RLS (calculated)
  note: 'VUV = IUV × RLS + VV and VOV = IOV × RLS + VV with the parameter-table values: IUV 22 / 25 / 27 µA with VV 2.10 / 2.8 / 3.20 V, and IOV 107 / 112 / 117 µA with VV 2.83 / 3.0 / 3.25 V (the TOP258 to TOP262 row). The range columns combine the minimum current with the minimum pin voltage and the maximum with the maximum, so they are the widest case. The UV low threshold is 44% of the start-up threshold (typical). The 4 MΩ row reproduces the datasheet example, 102.8 V and 451 V.'
  columns:
  - RLS
  - VUV typ
  - VUV range
  - UV low (44% of typ)
  - VOV typ
  - VOV range
  - VOV / VUV
  rows:
  - - 2 MΩ
    - 52.8 V
    - 46.1 to 57.2 V
    - 23.2 V
    - 227.0 V
    - 216.8 to 237.2 V
    - '4.30'
  - - 3 MΩ
    - 77.8 V
    - 68.1 to 84.2 V
    - 34.2 V
    - 339.0 V
    - 323.8 to 354.2 V
    - '4.36'
  - - 4 MΩ
    - 102.8 V
    - 90.1 to 111.2 V
    - 45.2 V
    - 451.0 V
    - 430.8 to 471.2 V
    - '4.39'
  - - 5 MΩ
    - 127.8 V
    - 112.1 to 138.2 V
    - 56.2 V
    - 563.0 V
    - 537.8 to 588.2 V
    - '4.41'
  - - 6 MΩ
    - 152.8 V
    - 134.1 to 165.2 V
    - 67.2 V
    - 675.0 V
    - 644.8 to 705.2 V
    - '4.42'
- title: Maximum duty cycle against DC bus voltage, RLS = 4 MΩ (calculated)
  note: IV = (V − 2.9 V) ÷ 4 MΩ. DCMAX is 78% below the onset current of 22 µA, then falls 1% per µA up to 48 µA and 0.25% per µA above that (typical values). The voltage at the V pin is taken as 2.9 V. The printed reference points, 76% at 100 V and 41% at 375 V, are reproduced.
  columns:
  - DC bus
  - V pin current
  - DCMAX
  - Note
  rows:
  - - 88 V
    - 21.3 µA
    - 78.0%
    - Line 88 V, the low end the text names
  - - 90.9 V
    - 22.0 µA
    - 78.0%
    - Reduction starts (IV = 22 µA)
  - - 100 V
    - 24.3 µA
    - 75.7%
    - DCMAX reference, low (printed 76%)
  - - 150 V
    - 36.8 µA
    - 63.2%
    - '-'
  - - 194.9 V
    - 48.0 µA
    - 52.0%
    - Slope changes (IV = 48 µA, the text says 195 V)
  - - 250 V
    - 61.8 µA
    - 48.6%
    - Low end of Figure 42
  - - 300 V
    - 74.3 µA
    - 45.4%
    - '-'
  - - 375 V
    - 93.0 µA
    - 40.7%
    - DCMAX reference, high (printed 41%)
  - - 380 V
    - 94.3 µA
    - 40.4%
    - High end of Figure 42, and the high end the text names (40%)
  - - 451 V
    - 112.0 µA
    - 36.0%
    - 'Overvoltage threshold (text: 36%)'
- title: Figure 42 at the ends of its input range (calculated)
  note: The 150 W supply of Figure 42, with the output taken as 19 V × 7.7 A = 146.3 W and the 84% efficiency the text gives. V pin numbers use the 4 MΩ of R4 and R5 and a V pin voltage of 2.9 V, as in the datasheet example. The X node row is the current R6 and R7 (9.4 MΩ) put into the X pin node with the pin taken at its typical 1.3 V; the datasheet describes that resistor as what lowers the current limit as the line voltage rises.
  columns:
  - Quantity
  - 250 VDC
  - 380 VDC
  - How
  rows:
  - - Input power at 84% (146.3 W out)
    - 174.2 W
    - 174.2 W
    - 19 V × 7.7 A ÷ 0.84
  - - Input current, ripple ignored
    - 0.70 A
    - 0.46 A
    - Input power ÷ bus voltage
  - - V pin current
    - 61.8 µA
    - 94.3 µA
    - (V − 2.9 V) ÷ (R4 + R5 = 4 MΩ)
  - - DCMAX, typical
    - 48.6%
    - 40.4%
    - Dual-slope curve from the V pin current
  - - Margin to the typical overvoltage threshold, 451 V
    - 201 V
    - 71 V
    - 112 µA × 4 MΩ + 3.0 V, minus the bus voltage
  - - Margin to the lowest overvoltage threshold, 430.8 V
    - 180.8 V
    - 50.8 V
    - 107 µA × 4 MΩ + 2.83 V (TOP258 minimum), minus the bus voltage
  - - Current from the bus into the X node
    - 26.5 µA
    - 40.3 µA
    - (V − 1.3 V) ÷ (R6 + R7 = 9.4 MΩ), X pin taken at 1.3 V
- title: Current limit against RIL (read by eye)
  note: Typical curve of Figure 55b, normalized to the default current limit, for a resistor from the X pin to SOURCE. Read by eye from the graph, to about ±0.03. The 12 kΩ and 19 kΩ points are printed in the figures on pages 6 and 7. The minimum and maximum curves are about ±0.1 wide near 12 kΩ.
  columns:
  - RIL
  - ILIMIT (fraction of default)
  - Source
  rows:
  - - 7.5 kΩ or less
    - 100%
    - Flat part of the curve; the knee is at about 7.5 kΩ
  - - 10 kΩ
    - about 75%
    - Read by eye
  - - 12 kΩ
    - 61%
    - Printed in Figures 5 and 6
  - - 15 kΩ
    - about 49%
    - Read by eye
  - - 19 kΩ
    - 37%
    - Printed in Figure 8
  - - 20 kΩ
    - about 35%
    - Read by eye
  - - 25 kΩ
    - about 26%
    - Read by eye
  - - 30 kΩ
    - about 21%
    - Read by eye
  - - 35 kΩ
    - about 17%
    - Read by eye
  - - 40 kΩ
    - about 15%
    - Read by eye
  - - 45 kΩ
    - about 13%
    - Read by eye
- title: Line sense window in AC terms (calculated)
  note: DC voltage divided by √2 is the AC RMS value whose sine peak equals it. It ignores ripple on the bulk capacitor, which the V pin sees, so the real line voltage at which a supply trips is higher. Inputs are the printed example with RLS = 4 MΩ.
  columns:
  - Point
  - DC input
  - AC RMS equivalent
  rows:
  - - Undervoltage threshold VUV
    - 102.8 V
    - 72.7 V
  - - Overvoltage threshold VOV
    - 451 V
    - 318.9 V
  - - DCMAX reference, low
    - 100 V
    - 70.7 V
  - - DCMAX reference, high
    - 375 V
    - 265.2 V
  - - Peak of a 265 VAC line (for comparison)
    - 374.8 V
    - 265.0 V
- title: Datasheet design examples (pages 21 to 24)
  note: The four complete power supplies in the datasheet, summarized from the figures and the text beside each. Efficiencies are as the text states them. Only Figure 42, the TOP258YN design, is redrawn on this page.
  columns:
  - Figure
  - Output
  - Input
  - Device
  - Efficiency
  - Notable features
  rows:
  - - 41 (page 21)
    - '35 W total: 12 V 2 A and 5 V 2.2 A'
    - 90 to 265 VAC
    - TOP258PN
    - 84% nominal at full load
    - P package with only PCB copper as heat sink, open frame at 50 °C. Line UV 100 VDC and OV 450 VDC from R3 and R4 (2.0 MΩ each). TVS plus RCD clamp. Hysteretic OVP through the M pin, or latching if R5 is reduced to 20 Ω. TL431 secondary loop with a soft-finish network
  - - 42 (page 22), drawn on this page
    - 150 W (19 V, 7.7 A)
    - 250 to 380 VDC
    - TOP258YN
    - 84%
    - At the top of the TOP258 range. Line sense 4 MΩ (R4 and R5) on the V pin; power limiting from R3, R6 and R7; clamp of two series TVS diodes plus R1, R2, C3; extra turn-off snubber (R20 to R22, D5, C18). Needs a heat sink that keeps the device below 110 °C
  - - 43 (page 23)
    - 20 W continuous, 80 W peak at 32 V
    - 90 to 264 VAC
    - TOP258MN
    - 82% nominal at full load
    - M package with a reduced current limit for short high-power bursts. R12 sets the limit and R11 and R14 reduce it with line voltage. Line sense by R1 and R2. Latching OVP and over-power shutdown through VR5, with a fast AC reset (Q1 to Q3)
  - - 44 (page 24)
    - '65 W: 19 V, 3.42 A'
    - 90 to 265 VAC
    - TOP260EN
    - 88%
    - Used at a reduced current limit for efficiency. Line sense 4 MΩ (R3 and R4), power limiting by R5 to R7, zener-and-diode clamp, bias-winding OVP (VR2) and an optional secondary OVP (VR3, U3)
datasheet: https://www.power.com/design-support/data-sheets/topswitch-hx-data-sheet
datasheet_revision: Rev. N (12/22), 50 pages, as supplied; the live copy on power.com was not checked. Table 1 updated per PCN-20112 in this revision
verified: true
draft: true
tags:
- flyback
- off-line
- topswitch-hx
- integrated-mosfet
- ac-dc
- line-sense
- power-integrations
- to-220-7c
- multi-mode
- 150w
---

## How it works

The TOP258YN is the TOP258 in the Y package (TO-220-7C), from Power Integrations' TOPSwitch-HX family. One datasheet, TOP252-262 (Rev. N, 12/22), covers all eleven sizes and six packages, so this page is built around the TOP258YN and brings in the rest of the family only to compare. Each device puts a 700 V power MOSFET, its gate driver, PWM control, a start-up current source on the drain, line sensing, an adjustable current limit and fault protection into one package. The supply around it needs a transformer, an output rectifier and capacitor, and an optocoupler feedback loop.

For the TOP258YN the datasheet gives a typical current limit of 4.30 A and an RDS(ON) of 1.7 Ω typical (1.95 Ω maximum) at 25 °C. Table 1 rates it at 105 W in a sealed adapter and 195 W open frame at 230 VAC ±15%, and at 70 W and 148 W over 85-265 VAC. Its design example, Figure 42, is a 150 W, 19 V supply that the datasheet says puts the part "at the upper limit of its power capability". That circuit is redrawn below.

What the datasheet says about how a TOPSwitch-HX works, in the order a supply sees it:

- **Start-up and the C pin.** The CONTROL pin takes both the supply current and the feedback current. At power-up a high-voltage current source charges the capacitor on C from the DRAIN pin. At about 5.8 V the control circuit wakes up and a 17 ms soft-start sweeps the peak drain current and the switching frequency from low to high. If no feedback current has arrived by the time VC falls to about 4.8 V, the part goes into auto-restart. A divide-by-16 counter then holds the MOSFET off for sixteen charge and discharge cycles, which gives an auto-restart duty cycle of typically 2%. Once the loop closes, a shunt regulator holds C at 5.8 V and the excess current becomes the PWM feedback signal. Its dynamic impedance ZC is 18 Ω typical.
- **Four operating modes.** At full load the part runs in full-frequency PWM (132 kHz with F tied to SOURCE, 66 kHz with F tied to CONTROL, jittered by ±5 kHz or ±2.5 kHz at 250 Hz). As the load falls, the peak drain current is held at kPS(UPPER) = 55% of the current limit while the frequency drops towards 30 kHz (variable-frequency mode). At 30 kHz the on-time shrinks (low-frequency PWM), until the peak current reaches kPS(LOWER) = 25% of the limit. At light load the part sends bursts of 4 or 5 pulses at 30 kHz and stays off until the C pin current drops below IC(OFF) (multi-cycle modulation). The datasheet says this keeps harmonics between 6 kHz and 30 kHz out of the transformer's resonance, so audible noise is suppressed.
- **Current limit.** The cycle-by-cycle limit uses the MOSFET's on-resistance as the sense element, with a 220 ns leading-edge blanking time. A resistor from the X pin to SOURCE lowers the limit to anywhere between 30% and 100% of the default, so a larger part can be used at a lower RDS(ON). A second resistor from the DC bus to the same pin lowers the limit as the line voltage rises, which gives power limiting and a lower clamp voltage at high line. Figure 42 does this with R3, R6 and R7.
- **Line sense.** One resistor from the DC bus to the V pin sets the undervoltage and overvoltage thresholds, which sit at a fixed ratio of 4.5. The same current drives line feed-forward and reduces the maximum duty cycle from 78% to 36% at the overvoltage threshold, in two slopes. Once the supply has started, the undervoltage threshold drops to 44% of the start-up value. On overvoltage the part stops switching after the current cycle. If that lasts at least 100 ms the output is forced off, and when the line is back to normal the part goes through the whole auto-restart sequence before it switches again.
- **Output overvoltage protection.** The same pin also detects an overvoltage on the output (through the bias winding, or through an optocoupler from the secondary). When the pin current exceeds IOV(LS), 336 µA typical, for more than 100 ms, the part latches off until the V pin falls below 1 V or the C pin falls below its power-up reset. A smaller current gives the non-latching, hysteretic version.
- **Remote on and off, thermal shutdown.** The V and X pins can turn the part on or off, and in the off state it draws very little (160 mW typical at 230 VAC with the pins open). Thermal shutdown trips at 142 °C typical, with 75 °C of hysteresis, and recovers by itself.

Figure 3 of the datasheet is the functional block diagram, in four versions for the different pin sets. The TOP258YN is covered by 3c, the version for the TOP254Y to TOP258Y and every eSIP package. It draws the blocks listed above: the shunt regulator and error amplifier on C, the internal supply switched from the DRAIN, the line-sense block, the oscillator with jitter, the PWM and current-limit comparators, and a set-reset latch driving the MOSFET.

**What this page can and can't tell you.** It is built from the full 50-page Rev. N datasheet (12/22). The specifications, tables and text are transcribed here and checked against it. It does not reproduce the typical-performance curves (apart from Figure 55b, read by eye), the PCB layout drawings (Figures 46 to 50), the pin-configuration circuits (Figures 14 to 40) or the package outline dimensions. Those are on pages 15 to 20, 27 to 31, 39 to 42 and 43 to 47 of the datasheet.

### Devices and packages

A part number reads `TOP 258 Y N`: the TOPSwitch family, the HX series number, the package letter and the pin finish. Y is the plastic TO-220-7C. The finish N is RoHS compliant and halogen free. The other finish, G, is also RoHS compliant and halogen free but is marked Not Recommended for New Designs. The only ordering option listed is TL, tape and reel for the G package (1000 minimum and multiple). Note 5 of Table 1 names the packages: P is DIP-8C, G is SMD-8C, M is SDIP-10C, Y is TO-220-7C, E is eSIP-7C and L is eSIP-7F.

The TOP258 comes in six versions. Table 1 prints the Y and E parts together as TOP258EN/YN/EG, so they share their power ratings, and the parameter table prints them together as YN/EN, so they share their current limit.

| Version | Package | ILIMIT typical (range) | 230 VAC adapter / open frame | 85-265 VAC adapter / open frame | Status in Rev. N |
| --- | --- | --- | --- | --- | --- |
| **TOP258YN (this page)** | Y, TO-220-7C | 4.30 A (3.999 to 4.601) | 105 W / 195 W | 70 W / 148 W | Not marked |
| TOP258EN, TOP258EG | E, eSIP-7C | 4.30 A (3.999 to 4.601) | 105 W / 195 W | 70 W / 148 W | Not marked; the G finish is Not Recommended for New Designs |
| TOP258LN | L, eSIP-7F | 3.00 A (2.790 to 3.210) | 105 W / 122 W | 70 W / 92 W | Obsolete per PCN-20112 (note 7) |
| TOP258PN, TOP258GN | P, DIP-8C and G, SMD-8C | 1.65 A (1.534 to 1.766) | 29 W / 48 W | 22 W / 35 W | Not marked |
| TOP258MN | M, SDIP-10C | 3.00 A (2.790 to 3.210) | 29 W / 48 W | 22 W / 35 W | Obsolete per PCN-20112 (note 7) |

The Y package is the one with the tab connected to SOURCE, and its thermal resistance is 80 °C/W junction to ambient free-standing (no heatsink) and 2 °C/W junction to case, measured at the back of the tab. Pin 6 is omitted. The table "Y-package parts, TOP254 to TOP261" under Recommended components shows the neighbours of the TOP258YN in the same package.

### Pins of the TOP258YN

Figure 4 shows the pinouts in a top view. The Y package of the TOP254 to TOP258 has these pins:

| Pin | Name | What the datasheet says |
| --- | --- | --- |
| 1 | VOLTAGE MONITOR (V) | Input for overvoltage and undervoltage sensing, line feed-forward with DCMAX reduction, output overvoltage protection (OVP), remote ON/OFF and device reset. Connecting it to SOURCE disables everything on this pin |
| 2 | EXTERNAL CURRENT LIMIT (X) | Input for adjusting the current limit and for remote ON/OFF. Connecting it to SOURCE disables everything on this pin |
| 3 | CONTROL (C) | The error amplifier and feedback current input for duty-cycle control. An internal shunt regulator on it gives the internal bias current in normal operation. It is also where the supply bypass and auto-restart and compensation capacitor connects |
| 4 | SOURCE (S) | The MOSFET source and high-voltage return. It is also the control circuit's common and reference |
| 5 | FREQUENCY (F) | Connected to SOURCE for 132 kHz, to CONTROL for 66 kHz. Leaving it open is not recommended |
| 7 | DRAIN (D) | The MOSFET drain. The start-up bias current comes from here through a switched high-voltage current source, and the drain current is sensed here for the current limit |
| Tab | SOURCE | Connected to SOURCE inside the package |

**F and S swap places between the Y package (S on pin 4, F on pin 5) and the E and L packages (F on pin 4, S on pin 5).** A board laid out for one will not take the other. The other versions of the TOP258 have these pins:

| Package | Pin numbers and names, in order |
| --- | --- |
| P and G | 1 M, 2 C, 4 D, 5 S, 6 S, 7 S, 8 S (no pin 3). The M pin combines the V and X functions and there is no F pin: these parts run at 66 kHz |
| M | 1 V, 2 X, 3 C, 5 D, 6 S, 7 S, 8 S, 9 S, 10 S (no pin 4). Fixed at 66 kHz |
| E and L | 1 V, 2 X, 3 C, 4 F, 5 S, 7 D (no pin 6) |

The TOP259 to TOP261 in the Y package have a SIGNAL GROUND pin G in place of F (pin 5) and run at a fixed 66 kHz.

## Example application

The datasheet's design example for this part is Figure 42, "150 W, 19 V Power Supply using TOP258YN", on page 22. It takes 250 to 380 VDC. The datasheet says a DC input is shown because at this power level a power factor correction stage would normally precede the supply. The datasheet's front-page Figure 1, a block-level circuit with no values, and Figure 5, the line-sense circuit, are further down.

### Reference circuit

![Figure 42 of the TOP252-262 datasheet, redrawn: a 150 W, 19 V flyback supply with the TOP258YN, 250 to 380 VDC in. The bus runs through fuse F1 and thermistor RT1, with bulk capacitor C1. R6 and R7 in series (4.7 MΩ each) go from the bus to the X pin, which has R3 (8.06 kΩ) to the negative rail. R4 and R5 in series (2.0 MΩ each) go from the bus to the V pin, which also takes the bias voltage through R19 and the 36 V zener VR2. The T1 primary runs from the bus to the drain node. The clamp has two P6KE100A suppressors in series, R1 and R2 (68 kΩ) and C3 in parallel, and the diode D1. A turn-off snubber of R20 to R22 in series, D5 and C18 also sits on the drain node. The C pin has C11 and R10 with C10 to the negative rail, and the phototransistor U2B connects it to the bias node. A bias winding feeds that node through D4 and R8, with C9 to the winding return. Two secondary windings with a centre tap (RTN) feed the MBR20100CT pairs D2 and D3, each with an RC snubber, to +19 V. C4 goes from the bus to the centre tap. C5 to C8, L1, C15 and C16 filter the output. R15, R16 and R17 divide the output into the TL431 U3, whose cathode drives the LED of optocoupler U2A through R12 (with C20), R24 and R11. R13, C12 and C13 compensate the loop. D6, R23 and C19 form a soft-finish branch.](schematic:top258yn-150w-schematic.svg)

| Ref | Part | Description | Maker |
| --- | --- | --- | --- |
| U1 | TOP258YN | Off-line flyback switcher, TO-220-7C | Power Integrations |
| F1 | Not given | Fuse, 4 A, in series with the DC input | Not given |
| RT1 | Not given | Thermistor, 5 Ω (the figure draws the thermistor symbol, "t°"), in series with the DC input | Not given |
| C1 | Not given | 22 µF 400 V. The text calls it local decoupling, needed when the supply is remote from the PFC output capacitor | Not given |
| R4, R5 | Not given | 2.0 MΩ each, in series from the bus to the V pin: the 4 MΩ line-sense resistor | Not given |
| R6, R7 | Not given | 4.7 MΩ each, in series from the bus to the X pin | Not given |
| R3 | Not given | 8.06 kΩ 1%, from the X pin to the negative rail. R3, R6 and R7 give the output power limiting | Not given |
| R19, VR2 | Not given, 1N5258B | 4.7 Ω, and a 36 V zener from the bias node to the V pin (our reading: bias-winding overvoltage protection, as the datasheet describes for the V pin) | Not given |
| VR1, VR3 | P6KE100A | Two series TVS diodes. The text says they are essential to hold the peak drain voltage below 700 V during start-up and overload | Not given |
| R1, R2 | Not given | 68 kΩ 2 W each, in parallel with C3 and the TVS stack, so the leakage energy is dissipated here in normal operation | Not given |
| C3 | Not given | 4.7 nF 1 kV | Not given |
| D1 | BYV26C | Clamp diode, anode on the drain node | Not given |
| R20, R21, R22 | Not given | 1.5 kΩ 2 W each, in series | Not given |
| D5, C18 | 1N4937 | With R20 to R22, an extra turn-off snubber that cuts turn-off loss in the TOP258YN. C18 is 120 pF 1 kV | Not given |
| C11 | Not given | 100 nF 50 V from the C pin to the negative rail | Not given |
| R10, C10 | Not given | 6.8 Ω in series with 47 µF 10 V from the C pin to the negative rail | Not given |
| T1 | EI35 | Transformer: primary pins 1 and 4, secondary windings 13,14 and 9,10 with a centre tap on 11,12, and a bias winding on 7 and 5. The text says a low-leakage sandwich winding with a copper-foil secondary was used | Not given |
| D4, R8, C9 | 1N4148 | Bias winding rectifier, a 4.7 Ω resistor and a 10 µF 50 V capacitor | Not given |
| D2, D3 | MBR20100CT | Two windings rectified by separate diodes to limit diode dissipation. Each is drawn as two diodes in parallel | Not given |
| R14, C14 and R18, C17 | Not given | 22 Ω 0.5 W in series with 47 pF 1 kV across each rectifier (the text does not discuss them) | Not given |
| C4 | Not given | 2.2 nF 250 VAC, from the bus (T1 pin 1) to the secondary return | Not given |
| C5 to C8 | Not given | Four 820 µF 25 V output capacitors, four so their ripple current rating is not exceeded | Not given |
| L1, C15, C16 | Not given | 3.3 µH and two 820 µF 25 V capacitors: switching noise filter | Not given |
| U3, R15, R16, R17 | TL431 (2%) | Reference. R16 31.6 kΩ 1%, R17 562 Ω 1% and R15 4.75 kΩ 1% divide the output | Not given |
| R12, C20, R24 | Not given | 240 Ω 0.125 W with 1.0 µF 50 V across it, and 30 Ω 0.125 W. R12 and R24 together limit the optocoupler LED current and set the loop's DC gain | Not given |
| R11 | Not given | 1 kΩ 0.125 W across the optocoupler LED (the text does not discuss it) | Not given |
| U2 | PC817A, PC817B | The optocoupler: the LED (U2A) on the secondary and the phototransistor (U2B) from the bias node to the C pin. The figure labels both halves U2 | Not given |
| R13, C12, C13 | Not given | 56 kΩ 0.125 W, 4.7 nF 50 V and 100 nF 50 V. With C20, the control loop compensation | Not given |
| D6, R23, C19 | 1N4148 | Soft finish: D6, a 15 kΩ 0.125 W resistor and a 10 µF 50 V capacitor feed current into the control pin before the output regulates, which prevents overshoot and ensures start-up at low line and full load | Not given |

> **About the source.** The drawing is Figure 42, labelled PI-4795-092007, on page 22 of the TOP252-262 datasheet, Rev. N (12/22). The part numbers, values and the designators are the figure's. The figure gives no manufacturers for anything except the TOPSwitch-HX, so the table says "Not given". The redraw keeps every connection but not the figure's layout. Four simplifications: the MOSFET and CONTROL box inside U1 is one block with pin names; the optocoupler is drawn as the figure draws it, two dashed boxes with the LED and the phototransistor, both labelled U2; a small hop marks each wire crossing that the figure draws without a dot; and the mid-point stub with a dot on the primary winding is not drawn. Reading the figure: C4 runs from the bus (T1 pin 1) to the T1 pin 11,12 node, which is RTN, and R12 with C20 sits between the +19 V rail and R24, while R23 and R16 connect to the +19 V rail itself. The figure's label says "150 W (19 V @ 7.7 A)"; 19 V × 7.7 A is 146.3 W. The datasheet copy is the 50-page Rev. N PDF the user supplied. The `datasheet:` address is Power Integrations' TOPSwitch-HX datasheet page, which we opened but whose live revision we did not check.

### Worked example, the 150 W supply (ours)

The text around Figure 42 gives 150 W (19 V at 7.7 A), 84% efficiency, a 250 to 380 VDC input, and a 4 MΩ line-sense resistor that stops switching above 450 VDC. Redone with the datasheet's parameters:

- **Output power.** 19 V × 7.7 A = **146.3 W**, which the label rounds to 150 W.
- **Input power.** At 84% efficiency 146.3 W needs 146.3 ÷ 0.84 = **174.2 W** in, so about 27.9 W is lost in the supply as a whole. (With the rounded 150 W the figures are 178.6 W and 28.6 W.) The loss is not all in the TOP258YN; the text only says the heat sink must keep the device below 110 °C at full load, low line and maximum ambient.
- **Input current.** 174.2 W ÷ 250 V = **0.70 A** at the bottom of the range and 174.2 W ÷ 380 V = **0.46 A** at the top, ignoring ripple on C1.
- **Line sense.** R4 + R5 = 4.0 MΩ, so the thresholds are the datasheet's: VUV = 25 µA × 4 MΩ + 2.8 V = **102.8 V** and VOV = 112 µA × 4 MΩ + 3.0 V = **451 V** (the text says 450 VDC). With the TOP258 tolerances on IOV and the V pin voltage the overvoltage threshold lies between **430.8 V** (107 µA × 4 MΩ + 2.83 V) and **471.3 V** (117 µA × 4 MΩ + 3.25 V), so even the lowest threshold is 50.8 V above the 380 V top of the input range (451 V is 71 V, or 18.7%, above it).
- **Maximum duty cycle.** The V pin current is (250 V − 2.9 V) ÷ 4 MΩ = **61.8 µA** at 250 VDC, which is past the 48 µA knee, so DCMAX = 78% − 26% − 0.25 × (61.8 − 48) = **48.6%**. At 380 VDC the current is **94.3 µA** and DCMAX = 52% − 0.25 × (94.3 − 48) = **40.4%**. (V pin voltage taken as 2.9 V, as in the datasheet's own example.)
- **X pin.** R6 + R7 = 9.4 MΩ puts (250 V − 1.3 V) ÷ 9.4 MΩ = **26.5 µA** into the X node at 250 VDC and (380 V − 1.3 V) ÷ 9.4 MΩ = **40.3 µA** at 380 VDC (X pin voltage taken as 1.3 V, the typical value at −50 µA). The datasheet describes this resistor as what lowers the current limit as the line rises. The table "Figure 42 at the ends of its input range (calculated)" under Recommended components has these numbers side by side.
- **Against Table 1.** The TOP258YN is rated 195 W open frame at 230 VAC and 148 W at 85-265 VAC, so 146.3 W is 75% of the first and 99% of the second. The two are not directly comparable: Table 1 assumes a 12 V output, a Schottky output diode, 135 V of reflected voltage and a device temperature of 100 °C or less, and Figure 42 uses a low-leakage foil-wound transformer, a TVS clamp with extra snubbing and a heat sink.

### The block-level circuit on the front page (Figure 1)

The datasheet's front page has Figure 1, "Typical Flyback Application". It has no reference designators and no component values, and it is drawn with the V, X and F pin set, which is the TOP258YN's. The drawing keeps only what the figure shows.

![Figure 1 of the TOP252-262 datasheet, redrawn. The AC input goes through a four-diode bridge to a bulk capacitor across the bus. The bus goes to the top of the transformer primary and, through a resistor, to the V pin. A zener diode in series with a diode runs from the bus to the drain node, where the primary's bottom end and the D pin meet. The S pin and the F pin go straight to the negative rail and the X pin goes through a resistor. The output winding feeds a diode and a capacitor, and a zener diode, a resistor and a diode in series across the output close the feedback loop. A bias winding feeds a diode and a capacitor, an optocoupler phototransistor connects that capacitor to the C pin, and the C pin also has a capacitor to the negative rail. The MOSFET and control box inside the package are drawn as one block with pin names.](schematic:top252-262-schematic.svg)

The drawing is Figure 1, labelled PI-4510-100206, on page 1 of the datasheet, Rev. N (12/22). The output sense diode is a plain diode in the figure, and the light arrows beside the phototransistor are what make it the optocoupler's LED: that is our reading. With F tied to SOURCE the part runs at 132 kHz (Figure 14); tied to CONTROL it runs at 66 kHz (Figure 15). The dots on the windings are the figure's. Figure 2 (PI-4973-122607) is the same circuit for the TOP259YN to TOP261YN, with a G pin in place of F, and is not drawn here.

### Line sense and external current limit (Figure 5)

Page 6 shows the V pin and X pin circuit that Figure 42 uses: a 4 MΩ resistor RLS from the positive DC input to the V pin, and a 12 kΩ resistor RIL from the X pin to the negative side. The drain and C pins are drawn dashed in the figure, so nothing is shown on them.

![Figure 5 of the TOP252-262 datasheet, redrawn (V pin version for the TOP254Y to TOP258Y and all M, E and L packages). The positive DC input goes through RLS, 4 MΩ, to the V pin. The X pin goes through RIL, 12 kΩ, to the negative rail, and the S pin goes straight to the negative rail. The drain and C pins are dashed: nothing is drawn on them.](schematic:top252-262-line-sense-schematic.svg)

The figure prints two formulas for the line thresholds:

- VUV = IUV × RLS + VV, where IV = IUV
- VOV = IOV × RLS + VV, where IV = IOV

The parameter table supplies the numbers: IUV is 25 µA typical (22 to 27 µA), IOV is 112 µA typical (107 to 117 µA), and the V pin sits at 2.8 V at IUV and 3.0 V at IOV.

#### Worked example, RLS = 4 MΩ (the datasheet's, redone)

The figures print VUV = 102.8 VDC, VOV = 451 VDC, DCMAX = 76% at 100 VDC and DCMAX = 41% at 375 VDC, and ILIMIT = 61% with RIL = 12 kΩ. The typical parameter values give the same numbers:

- VUV = 25 µA × 4 MΩ + 2.8 V = 100 V + 2.8 V = **102.8 V** (exact)
- VOV = 112 µA × 4 MΩ + 3.0 V = 448 V + 3.0 V = **451 V** (exact)
- The maximum duty cycle starts to fall when IV passes 22 µA. Between 22 µA and 48 µA it falls by 1% per µA, and above 48 µA by 0.25% per µA. At 100 VDC, IV = (100 − 2.9) V ÷ 4 MΩ = 24.3 µA, so DCMAX = 78% − 1 × (24.3 − 22) = 75.7%, which is the printed **76%**. At 375 VDC, IV = 93.0 µA, so DCMAX = 78 − 26 − 0.25 × (93.0 − 48) = 40.7%, the printed **41%**. (V pin voltage taken as 2.9 V.)
- The knee at 48 µA is (48 µA × 4 MΩ) + 2.9 V = 194.9 V, which is the "195 V" the text names. At the overvoltage threshold DCMAX comes to 36.0%, which is the "36% (typical)" the text gives for that point.
- RIL = 12 kΩ gives ILIMIT = 61% of the default current limit, from Figure 55b. Figure 8 gives 37% for 19 kΩ.

The tables "Line sense thresholds against RLS (calculated)" and "Maximum duty cycle against DC bus voltage, RLS = 4 MΩ (calculated)" under Recommended components extend this to other values, using the TOP258 limits. "Current limit against RIL (read by eye)" is the typical curve of Figure 55b. The "Line sense window in AC terms (calculated)" table turns the printed voltages into the AC RMS value whose peak equals them. 375 VDC is the peak of a 265 VAC line (265 × √2 = 374.8 V), which is presumably why the datasheet uses it (our reading).

### The datasheet's other design examples

Pages 21 to 24 give three more finished power supplies: Figure 41 (35 W dual output, TOP258PN), Figure 43 (20 W continuous, 80 W peak, TOP258MN) and Figure 44 (65 W, TOP260EN). They use other packages or sizes and are not redrawn here. The key facts of all four designs, Figure 42 included, are in the table "Datasheet design examples" under Recommended components.

### Choosing a size from Table 1 (worked example, ours)

Table 1's notes define the columns. Adapter is the minimum continuous power in a typical non-ventilated enclosed adapter at +50 °C ambient, Open Frame is the minimum continuous power in an open-frame design at +50 °C, and Peak is the peak power capability in any design at +50 °C. Note 4 says the 230 VAC columns also cover 110/115 VAC with a doubler.

Say the supply needs 60 W continuous at 85-265 VAC. For the E, L and Y packages, the 85-265 VAC columns read:

- **Sealed adapter:** TOP255 26 W, TOP256 40 W, TOP257 55 W, TOP258 70 W. The TOP257 falls 5 W short, so the **TOP258YN (70 W)** is the first Y or E part that clears 60 W.
- **Open frame:** TOP255 57 W, TOP256 86 W, TOP257 119 W, TOP258 148 W. The TOP255 is 3 W short and the TOP256YN (86 W) is the first that clears 60 W, so the TOP258YN is oversized in an open frame.

The "Design considerations" section behind Table 1 says the figures assume a 12 V output, a Schottky output diode, 135 V reflected voltage, a 100 VDC minimum bus at 85-265 VAC (250 VDC at 230 VAC), a device temperature of 100 °C or less, and, for the P and M packages, 6.45 cm² of copper in an enclosed adapter or 19.4 cm² in an open frame.

## Layout

The datasheet's layout section (page 27 and Figures 46 to 50, one drawing for each package) and its design-considerations text say:

- **SOURCE is the controller's ground.** Use a single-point (Kelvin) connection at the negative terminal of the input filter capacitor for the SOURCE pin and the bias winding return. Return the SOURCE switching current to the input capacitor on its own trace, which the components on C, V, X and F must not share.
- **The C pin capacitor** goes as close as possible to the SOURCE and CONTROL pins. The datasheet's circuits use 47 µF there (Figure 42 uses C10, 47 µF 10 V, with 6.8 Ω in series and a 100 nF capacitor in parallel), and says a high-frequency capacitor in parallel may be added for noise immunity.
- **V pin parts are noise-sensitive.** The pin runs at very low current to hold down the no-load power. Keep its traces away from the drain, clamp, bias return and other switching traces. Put the line-sense resistors within 10 mm of the V pin and route the DC bus to them. **Never connect a capacitor to the V pin.**
- **Keep the optocoupler output** close to the C and S pins and away from the drain and clamp traces.
- **Y capacitor:** connect it close to the secondary return pins and the positive primary DC pin of the transformer.
- **Heat sinking the Y package.** The tab is tied to SOURCE inside the package. A heatsink on it must not be tied electrically to any primary ground or source node on the board, or circulating currents flow. Figure 42's text says the device must stay below 110 °C at full load, low line and maximum ambient, and that airflow may be needed if a large heat sink is not acceptable.
- **Bias winding capacitor:** 10 µF is recommended because the part runs at low frequency at no load (Figure 42 uses 10 µF 50 V).
- **Input capacitor:** about 2 µF per watt is possible at universal input with a well-designed transformer.
- **Clamp and transformer:** with a zener clamp, choose a zener of at least 1.5 times the reflected voltage VOR and keep VOR under 135 V. With an RCD clamp (and current limit reduction with line voltage) VOR can reach 150 V. Design for a maximum operating flux density of 3000 gauss and a peak of 4200 gauss at the maximum current limit. At high primary current, the Figure 42 text says a low-leakage transformer is essential and the leakage energy can exceed what a simple zener clamp can take, hence its TVS pair with R1, R2 and C3.
- **Bench checks:** peak drain-source voltage no more than 675 V at the highest input and maximum overload; check the drain current at start-up for transformer saturation and for a leading-edge spike inside the current limit envelope (Figure 53) at the end of the 220 ns blanking time; and check temperatures at maximum power with minimum and maximum line.
- This site has no KiCad symbol or footprint for this part yet. The Y package has pins 1 V, 2 X, 3 C, 4 S, 5 F and 7 D, with pin 6 omitted and the tab at SOURCE.

Pin 1 is the V pin. In Figure 4 it is the leftmost lead of the Y package.

## What the datasheet shows

The 50-page Rev. N (12/22) datasheet: front page with Table 1 and the notes (1 to 2), block diagrams (3 to 5), pins and function (6 to 14), typical uses of the F, V, X and M pins as small circuits, Figures 14 to 40 (15 to 20), four application examples (21 to 24), the HX versus GX comparison and design and layout considerations (25 to 31), the product specifications (32 to 38), typical performance curves (39 to 42), package outlines (43 to 47), ordering information (48) and the revision history (49). Table 1 was updated per PCN-20112 in Rev. N.

## Things to watch

- **The M and L packages are marked obsolete; the Y package is not.** Table 1 of Rev. N flags every M and L device with note 7, "obsolete per PCN-20112". The TOP258YN row is not flagged. Don't use the TOP258MN or TOP258LN as a stand-in.
- **Lifecycle status is unclear.** Beyond the datasheet note above, some distributors label individual numbers discontinued or obsolete, for example RS listings for TOP252EN, TOP258EN and TOP258MN, which we did not confirm. Check availability of the TOP258YN before designing in. The pin finish G in a part number is "not recommended for new designs"; the YN has the N finish.
- **F and S are swapped between the Y package and the E and L packages.** Switching a TOP258YN for a TOP258EN is not a drop-in change on the same footprint.
- **Figure 42 is at the part's limit.** The text says the TOP258YN is at the upper limit of its power capability at 150 W, 84% efficient from 250 to 380 VDC. It needs a heat sink that holds the device below 110 °C, a low-leakage foil-wound transformer and a TVS clamp with an extra turn-off snubber. The 195 W open-frame rating in Table 1 and the 150 W of Figure 42 are stated under different conditions (see the worked example).
- **The line-sense numbers move with the V pin spec.** The 4 MΩ example gives 102.8 VDC and 451 VDC at typical values. With the printed tolerances on IUV, IOV and the V pin voltage (the TOP258 limits for the overvoltage point), the same resistor puts the thresholds anywhere between about 90 V and 111 V for undervoltage and 431 V and 471 V for overvoltage (see the line-sense table).
- **ILIMIT depends on the package, not only the size.** A TOP258 has 4.30 A typical in Y and E, 3.00 A in M and L, and 1.65 A in P and G. The versions table above lists them.
- **The overvoltage threshold at 4 MΩ is 76 V above the 265 VAC peak.** That is 451 V against 374.8 V, so overvoltage trips when the DC bus is about 20% above that peak (our arithmetic; the bus also carries ripple).
- **Primary-side OVP won't catch every open-loop fault.** The datasheet says the bias-winding detector fires on a significant rise of the output. If the open loop happens under heavy load or low line, the output may not rise enough to latch until the conditions change. Primary sensing holds a nominal 12 V output below roughly 20 V in an open loop; a secondary-sensed circuit is recommended where more accuracy is needed.
- **Figure 1 and Figure 42 are the V, X and F pin set.** That is the TOP258YN's. The P and G packages have an M pin instead of V and X and no F pin; the TOP259Y to TOP261Y have a G pin instead of F. Figure 2 is the G-pin version.
- **Missing pin numbers are normal.** The Y package skips pin 6.
- **This is Rev. N (12/22).** Revisions B to M came earlier. The power values in Table 1 are the same as in Rev. F (January 2009), which an earlier version of this page used; the notes and the obsolescence flags are what changed.

## Datasheet notes

- **Figure 42 says "150 W (19 V @ 7.7 A)".** 19 V × 7.7 A is 146.3 W. The 150 W is the output power as the text rounds it.
- **Figure 42 labels both halves of the optocoupler U2.** The LED is PC817A and the phototransistor is PC817B.
- **Figure 42 gives no transformer winding data.** It prints only the core, EI35, and the pin numbers; the text says a sandwich winding with a copper-foil secondary was used.
- **Table 4 gives the lowest DIP-8 RDS(ON) as 1.8 Ω for the TOP258P,** while the parameter table gives 1.7 Ω typical and 1.95 Ω maximum at 25 °C for the TOP258.
- **Note 7 of Table 1 changed meaning.** In Rev. F it was an availability note for the halogen-free TOP256E; in Rev. N it means obsolete per PCN-20112 (the revision history says Rev. H removed the old note 7).
- **The text quotes two duty-cycle ranges for the same feature.** The maximum-duty-cycle section says DCMAX falls from 78% to 40% as the line goes from 88 V to 380 V, and the feed-forward section says it falls from 78% to 36% at the OV threshold. They are consistent: 380 V is below the 451 V OV threshold (the line-sense table gives 40.4% at 380 V and 36.0% at 451 V).
- **The DRAIN supply voltage entry has two values.** 18 V is printed with the condition TJ ≤ 85 °C (note E), and a second row reads 36 V with no condition.
- **The section list puts Part Ordering Information on page 47,** and it is on page 48 (package outlines run from 43 to 47).
