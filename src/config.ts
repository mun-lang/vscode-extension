import * as vscode from 'vscode';

/**
 * The `Config` class is a class that holds and maintain the configuration for the extension.
 */
export class Config {
    readonly extensionId = "mun-lang.mun"
    readonly rootSection = "mun"

    private readonly requiresReloadOpts = [
        "executablePath",
    ]
        .map(opt => `${this.rootSection}.${opt}`);

    readonly package: {
        version: string;
    } = vscode.extensions.getExtension(this.extensionId)!.packageJSON;

    constructor(ctx: vscode.ExtensionContext) {
        vscode.workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, ctx.subscriptions);
        this.refreshLogging()
    }

    /**
     * Update what we do with logging based on the current configuration.
     */
    private refreshLogging() {
        console.info(
            "Extension version: ", this.package.version,
            "using configuration: ", this.cfg)
    }

    /**
     * Called when the configuration of the extension changed.
     * @param event Information about what transpired
     */
    private async onDidChangeConfiguration(event: vscode.ConfigurationChangeEvent) {
        this.refreshLogging();

        const requiresReloadOpt = this.requiresReloadOpts.find(
            opt => event.affectsConfiguration(opt)
        );

        if (!requiresReloadOpt) return;

        const userResponse = await vscode.window.showInformationMessage(
            `Changing "${requiresReloadOpt}" requires a reload`,
            "Reload now"
        );

        if (userResponse === "Reload now") {
            await vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
    }

    private get cfg(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration(this.rootSection);
    }
    private get<T>(path: string): T {
        return this.cfg.get<T>(path)!;
    }

    get executablePath() { return this.get<null | string>("executablePath") }
}
