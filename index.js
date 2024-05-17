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
import { fileURLToPath } from "url";
import { dirname } from "path";
import { promisify } from "util";

const exec = promisify(child_process.exec);

async function main() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
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

    async function handleScaffold() {
      try {
        const spin = spinner();
        spin.start("Initializing project");
        try {
          const folder = await fs.readdir(path.join("./"));
          if (folder.includes(projectName)) {
            cancel("Directory already exists");
            process.exit(0);
          }
          await fs.mkdir(path.join("./", projectName));
        } catch (err) {
          console.log(chalk.redBright(" An error occurred: ", err));
          cancel("create-default-app scaffold cancelled.");
          process.exit(0);
        }

        const files = await fs.readdir(path.join(__dirname, "files"));
        const existingFiles = await fs.readdir(path.join("./", projectName));
        const conflicts = files.filter((file) => existingFiles.includes(file));
        if (conflicts.length > 0) {
          console.error(
            ` The following files already exist in the directory: ${conflicts.join(
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
        await fs.copy(
          path.join(__dirname, "files", "app.js"),
          path.join("./", projectName, "app.js")
        );

        await exec("npm init -y", {
          cwd: path.join("./", projectName),
        });

        spin.message("Installing tailwindcss via npm");
        if (styleFramework == "tailwindcss") {
          await exec("npm install -D tailwindcss", {
            cwd: path.join("./", projectName),
          });
        }
        spin.stop("Initialization complete");
        outro(chalk.greenBright(`Project scaffolded successfully!`));

        console.log(chalk.blueBright(` use command "cd ${projectName}"`));
        if (styleFramework == "tailwindcss") {
          console.log(
            chalk.blueBright(
              ` use command "npx tailwindcss -i ${path.join(
                "./",
                "style.css"
              )} -o ${path.join(
                "./",
                "output.css"
              )} --watch" to process tailwindcss`
            )
          );
        }
      } catch (error) {
        console.log(chalk.redBright("An error occurred: ", error));
        cancel(" create-default-app scaffold was cancelled.");
        process.exit(0);
      }
    }

    await handleScaffold();
  } catch (error) {
    if (isCancel(error)) {
      console.log(
        chalk.redBright(" create-default-app scaffold was cancelled. ")
      );
      process.exit(0);
    } else {
      console.log(chalk.redBright(" An error occurred: ", error));
    }
  }
}

main().catch((error) => {
  console.error(chalk.redBright("An error occurred:", error));
});
