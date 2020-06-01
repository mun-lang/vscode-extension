import * as os from "os"

import { ExtensionContext } from "vscode";
import { Config } from "./config";
import { createLanguageClient } from "./client";
import { LanguageClient } from "vscode-languageclient";

let client: LanguageClient | null;

/**
 * Called when the plugin is activated
 * @param context The vscode context for this extension
 */
export async function activate(context: ExtensionContext) {

    const config = new Config(context);

    // Bootstrap the extension, this returns an optional Mun executable path which we can use to 
    // initialize a language server with
    const executablePath = await bootstrap(config);
    if (executablePath != null) {
        // TODO: Turn this into a warning when the language server is actually useful

        // Initialize the language client and wait for it to load
        client = createLanguageClient(executablePath, ".")
        context.subscriptions.push(client.start());
        await client.onReady();
        console.log("started Mun language server")
    }
}

/**
 * Called when the plugin is deactivated
 */
export function deactivate() {
    // Stop the language client if one was initialized
    if (client) {
        client.stop();
        client = null
    }
}

/**
 * Called to bootstrap the extension before its is started
 * @param config The vscode context for this extension
 */
async function bootstrap(config: Config): Promise<string | null> {
    /// Try to get the Mun executable
    const path = await getExecutable(config);
    if (!path) {
        return null
    }

    console.log("Using mun binary at", path);

    return path
}

/**
 * Find the Mun executable somewhere.
 * @param config The vscode context for this extension
 */
async function getExecutable(config: Config): Promise<string | null> {
    const explicitPath = process.env.__MUN_BIN_DEBUG ?? config.executablePath;
    if (explicitPath) {
        if (explicitPath.startsWith("~/")) {
            return os.homedir() + explicitPath.slice("~".length);
        }
        return explicitPath;
    }

    return null;
}
