import chalk from "chalk";
export default class logging {
}
logging.info = (args) => console.log(chalk.blue(`[${new Date().toLocaleString()}] [Info]`), typeof args === "string" ? chalk.blueBright(args) : args);
logging.warn = (args) => console.log(chalk.yellow(`[${new Date().toLocaleString()}] [Warrnning]`), typeof args === "string" ? chalk.yellowBright(args) : args);
logging.error = (args) => console.log(chalk.red(`[${new Date().toLocaleString()}] [Error]`), typeof args === "string" ? chalk.redBright(args) : args);
