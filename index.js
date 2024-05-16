#!/usr/bin/env node

import {
  intro,
  outro,
  isCancel,
  cancel,
  text,
  confirm,
  spinner,
  select,
} from "@clack/prompts";
import child_process from "child_process";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

async function main() {
  try {
    intro(chalk.blueBright(" create-default-app "));

    let projectName = await text({
      message: "What is the name of your project?",
      placeholder: "my-project",
      validate(value) {
        if (value.length === 0) return `project name is required!`;
        if (value.match(" ") !== null) return `invalid project name!`;
      },
    });

    if (isCancel(projectName)) {
      cancel("create-default-app scaffold cancelled.");
      process.exit(0);
    }

    const styleFramework = await select({
      message: "Which CSS framework will you use?",
      options: [
        { value: "none", label: "none" },
        { value: "bootstrap", label: "bootstrap" },
        { value: "tailwindcss", label: "tailwindcss" },
      ],
    });

    if (isCancel(styleFramework)) {
      cancel("create-default-app scaffold cancelled.");
      process.exit(0);
    }

    const s = spinner();
    s.start("initializing project");

    try {
      const folder = await fs.readdir(path.join("./"));
      if (folder.includes(projectName)) {
        cancel("directory already exists");
        process.exit(0);
      }
      await fs.mkdir(path.join("./", projectName));
    } catch (err) {
      console.log(chalk.redBright(err));
      cancel("create-default-app scaffold cancelled.");
      process.exit(0);
    }

    async function copyFiles() {
      try {
        const files = await fs.readdir(path.join(__dirname, "files"));
        const existingFiles = await fs.readdir(path.join("./", projectName));
        const conflicts = files.filter((file) => existingFiles.includes(file));

        if (conflicts.length > 0) {
          console.error(
            `The following files already exist in the directory: ${conflicts.join(
              ", "
            )}`
          );
          const overwrite = await confirm({
            message: "Do you want to overwrite the existing files?",
            initialValue: false,
          });

          if (isCancel(overwrite) || !overwrite) {
            cancel("create-default-app scaffold cancelled.");
            process.exit(0);
          }
        }

        if (styleFramework == "none") {
          await fs.copy(
            path.join(__dirname, "files", "default"),
            path.join("./", projectName)
          );
        } else if (styleFramework == "bootstrap") {
          await fs.copy(
            path.join(__dirname, "files", "bootstrap"),
            path.join("./", projectName)
          );
        } else if (styleFramework == "tailwindcss") {
          await fs.copy(
            path.join(__dirname, "files", "tailwindcss"),
            path.join("./", projectName)
          );
        }
      } catch (err) {
        console.error(chalk.redBright(err));
        process.exit(0);
      }
    }

    await copyFiles();

    try {
      child_process.execSync("npm init -y", {
        cwd: path.join("./", projectName),
      });
    } catch (error) {
      console.error(
        `Failed to initialize npm in project ${projectName}:`,
        error
      );
      process.exit(1);
    }
    if (styleFramework == "tailwindcss") {
      child_process.execSync("npm install -D tailwindcss", {
        cwd: path.join("./", projectName),
      });
    }

    s.stop("initialization complete");

    if (isCancel(projectName)) {
      cancel("create-default-app scaffold cancelled.");
      process.exit(0);
    }

    outro(
      chalk.greenBright(` project ${projectName} scaffolded successfully! `)
    );

    if (styleFramework == "tailwindcss") {
      console.log(
        chalk.blueBright(
          "use command `npx tailwindcsscss -i ./src/input.css -o ./src/output.css --watch` to process tailwindcss"
        )
      );
    }
  } catch (error) {
    if (isCancel(error)) {
      console.log(
        chalk.redBright(" create-default-app scaffold was cancelled. ")
      );
    } else {
      console.error(error);
    }
  }
}

main().catch((error) => {
  console.error(chalk.redBright("An error occurred:", error));
});
