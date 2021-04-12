import yaml from "js-yaml";
import fs from "fs";

export const resources = {
  ja: yaml.load(fs.readFileSync("./src/rue/locales/config/ja.yml", "utf8")),
  en: yaml.load(fs.readFileSync("./src/rue/locales/config/en.yml", "utf8")),
};
