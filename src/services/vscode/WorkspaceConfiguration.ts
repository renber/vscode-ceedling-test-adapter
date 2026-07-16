import { ProjectConfig } from "../../models";
import { ProblemMatchingPattern } from "../../problemMatcher";
import { ExtensionConfiguration } from "../interfaces";
import vscode from 'vscode';

/**
 * Implementation of ExtensionConfiguration which retrieves values from the VS Code workspace configuration
 */
export default class VSCodeWorkspaceConfiguration implements ExtensionConfiguration
{
    constructor(readonly workspaceFolder: vscode.WorkspaceFolder)
    {
        // --
    }

    private getConfiguration(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration('ceedlingExplorer', this.workspaceFolder.uri);
    }

    public isProblemMatchingEnabled(): Boolean {
        return this.getConfiguration().get<boolean>('problemMatching.enabled', false)
    }    

    public getShellPath(): string | undefined {
        const shellPath = this.getConfiguration().get<string>('shellPath', 'null');
        return shellPath !== "null" ? shellPath : undefined;        
    }

    public getAnsiEscapeSequencesRemoved(): boolean {
        return this.getConfiguration().get<boolean>('ansiEscapeSequencesRemoved', true);
    }

    public getProjectConfigurations(): Array<ProjectConfig>
    {
        return this.getConfiguration().get<object>('projects', []) as Array<ProjectConfig>;
    }
    
    public getTestCommandArguments(): Array<string>
    {
        const defaultTestCommandArgs = ["test:${TEST_ID}"];
        return this.getConfiguration().get<Array<string>>('testCommandArgs', defaultTestCommandArgs)
    }

    public getTestCaseMacroAliases(): Array<string> {
        return this.getConfiguration().get<Array<string>>('testCaseMacroAliases', ['TEST_CASE']);
    }

    public getTestRangeMacroAliases(): Array<string> {
        return this.getConfiguration().get<Array<string>>('testRangeMacroAliases', ['TEST_RANGE']);
    }

    public usePrettyTestFileLabel(): Boolean
    {
        return this.getConfiguration().get<boolean>('prettyTestFileLabel', false);            
    }

    public usePrettyTestCaseLabel(): Boolean
    {
        return this.getConfiguration().get<boolean>('prettyTestLabel', false);
    }

    public getProblemMatchingMode(): string
    {
        return this.getConfiguration().get<string>('problemMatching.mode', "");
    }
    
    public getProblemMatchingPatterns(): Array<ProblemMatchingPattern>
    {
        return this.getConfiguration().get<ProblemMatchingPattern[]>('problemMatching.patterns', []);
    }
}