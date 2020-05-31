import * as lc from "vscode-languageclient";
import * as vscode from "vscode";

/**
 * Create the configuration for a Mun language client
 * @param munExecutablePath The path to the Mun executable
 * @param cwd The directory to use as a working directory for the Mun executable.
 */
export function createLanguageClient(munExecutablePath: string, cwd: string): lc.LanguageClient {
    const run: lc.Executable = {
        command: munExecutablePath,
        args: ["language-server"],
        options: {
            cwd,
        },
    }

    const serverOptions: lc.ServerOptions = {
        run,
        debug: {
            ...run,
            options: {
                ...run.options,
                env: {
                    "RUST_LOG": "mun_language_server=trace"
                }
            }
        }
    }

    const traceOutputChannel = vscode.window.createOutputChannel(
        "Mun Language Server Trace"
    );

    const clientOptions: lc.LanguageClientOptions = {
        documentSelector: [{ scheme: "file", language: "mun" }],
        initializationOptions: vscode.workspace.getConfiguration("mun"),
        traceOutputChannel,
    }

    const client = new lc.LanguageClient(
        "mun",
        "Mun Language Server",
        serverOptions,
        clientOptions,
    );

    return client
}
