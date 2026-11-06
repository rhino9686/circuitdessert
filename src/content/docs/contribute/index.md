---
title: Bring a circuit to the table
description: "How to contribute a recipe or a part to Circuit Dessert."
sidebar:
  order: 1
---

Circuit Dessert is an open repository of fun circuits and reference designs. If you've built something worth plating, share it. Contributions are pull requests: the site is a Git repository, and GitHub handles review, history and credit.

## How it works

- **Open by default.** Designs are shared with their schematics, parts lists and notes, so anyone can build, learn from and remix them.
- **Plated like a recipe.** Every entry gets a recipe-style page: key components as ingredients, build notes as the method.
- **Any brand, any scale.** A weekend blinky or a 12 kW supply, built on any manufacturer's parts. All of it is welcome.
- **Credit where it's due.** Your name and a link to the original go on the page, and any manufacturer reference design stays credited to its maker.

## Pick what you're adding

- [**A recipe**](site:contribute/recipe/): a worked-out board or reference design, with its layout, build notes or measurements.
- [**A part**](site:contribute/part/): one page of specs checked against the datasheet, plus your notes on using it and an example application when the datasheet gives a circuit.
- [**An Arduino interface**](site:contribute/arduino/): a section on a part page that wires an ESP32-S3 to the part's I2C, SPI or UART bus, with a level and pull-up check and a sketch.
- [**Images**](site:contribute/images/): how to add pictures, scope captures and diagrams without bloating the repository.

## The short version

1. Fork the repository and create a branch.
2. Copy the template for what you're adding and fill it in.
3. Run `npm install`, then `npm run dev` to preview, and `npm run validate` to check your files.
4. Open a pull request. The template has a short checklist, and automated checks run on every PR.
5. A maintainer reviews it, you tidy up anything they ask for, and it's merged and published.

## Before you ask

**Does it have to be my own design?** Your own designs are the heart of it. You can also submit a manufacturer's published reference design; it stays credited to the manufacturer, with a link to the original.

**Which license applies?** Your write-up and drawings are published under CC BY 4.0, and code under MIT; see [Licenses](site:licenses/). If you also share design files (schematic, layout, firmware), name their license in the recipe's `license` field. Any open license works (CERN-OHL, TAPR, MIT, CC BY, and so on). If a design has no license, we'll ask before listing it.

**Does it need to be finished or tested?** No. Just be upfront about what's been built and measured and what hasn't.

**Do I need to be a professional engineer?** Not at all. Students, hobbyists and working engineers are all welcome. A good weekend circuit is as welcome as a kilowatt supply.

**I'm not comfortable with Git.** Open an issue describing your design and link to where it lives. Someone may be able to help turn it into a recipe.
