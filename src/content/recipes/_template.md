---
# Copy to src/content/recipes/<short-id>.md. Files starting with "_" are ignored by the build.
# If a value contains a colon followed by a space (": "), wrap the whole value in double quotes.
title: Descriptive title of the design
design_id: ABC-12345            # manufacturer's ID (optional)
manufacturer: Texas Instruments # optional
kind: reference-design          # reference-design | tutorial
category: Power / DC-DC
summary: One or two sentences, under 300 characters. Used on cards and in search.
abstract: A longer intro shown under the title (plain text). Optional; the summary is used if you leave it out.
source: https://example.com/source
source_revision: Rev 1.0 (May 2026)  # which revision of the source your numbers were checked against (optional)
pantry_id: example-pantry-id    # the id of the Pantry card this expands, in src/data/pantry.yaml (optional)
draft: false                    # true while the prose still needs a human review
stats:                          # up to 4 headline numbers
  - { value: "5 V, 8 A", label: configured output }
components:                     # parts link automatically if a part page exists
  - { ref: U1, part: LT8645S, description: 65 V, 8 A synchronous buck, maker: Analog Devices }
  - { ref: RH, part: "100 kΩ, 1%, 0603", description: Upper feedback resistor }
schematic: example-schematic.svg # optional drawing in src/assets/recipes/ (see the contribute guide)
schematic_caption: Reference circuit for a 5 V output.
author: Your Name                # who made it (a manufacturer for published reference designs)
license: CERN-OHL-P-2.0         # any open hardware or content license; name it here
hero: example.svg               # optional file in src/assets/recipes/
hero_caption: Illustration only. See the source for the actual board.
tags: []
---

## Design requirements

| What | The design |
| --- | --- |
| Input voltage | 12 V |
| Output | 5 V, 3 A |

## How it works

Write the recipe: what the design does, how it works, what to watch for when building it.

> A note: start a paragraph with ">" to make it a callout.

## Documents

- [Design guide](https://example.com/guide.pdf)

<!-- Each "## " heading becomes a numbered section card. Start the body with one. -->
