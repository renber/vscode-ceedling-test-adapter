import { Logger } from './logger';
import stripAnsi from 'strip-ansi';
import util from 'util';
import vscode from 'vscode';
import child_process from 'child_process';
import tree_kill from 'tree-kill';
import { ProjectData } from './models';

export class Ceedling
{
    private ceedlingProcess: child_process.ChildProcess | undefined;
    public shell: string | undefined = undefined

    constructor(    
        private readonly workspaceFolder: vscode.WorkspaceFolder,
        private readonly logger: Logger,
    ) {

    }    

    private getConfiguration(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration('ceedlingExplorer', this.workspaceFolder.uri);
    }

    public async getCeedlingVersion(): Promise<string> {
        const result = await this.execCeedling(['version'], undefined);
        const regex = new RegExp('^\\s*Ceedling\\s*(?:::|=>)\\s*(.*)(?:\\n)*$', 'gm');
        const match = regex.exec(result.stdout);
        if (!match) {
            this.logger.error(`fail to get the ceedling version: ${util.format(result)}`);
            return '0.0.0';
        }
        return match[1].trim();
    }

    private getCeedlingCommand(args: ReadonlyArray<string>) {
        const line = `ceedling ${args.join(" ")}`;
        return line;
    }

    
    /*
    private getShellPath(): string | undefined {
        const shellPath = this.getConfiguration().get<string>('shellPath', 'null');
        return shellPath !== "null" ? shellPath : undefined;        
    }*/
    
    public execCeedling(args: ReadonlyArray<string>, projectData: ProjectData | undefined): Promise<any> {
        let cwd = ".";
        let projectParam = ` --project project.yml`;
        if (projectData)
        {
            if (projectData.ymlFileName != 'project.yml') {
                projectParam += ` --mixin ${projectData.ymlFileName}`;
            }
            args = [...args, projectParam];
            cwd = projectData.absPath;
        }        

        let command = this.getCeedlingCommand(args);
        
        this.logger.debug(`execCeedling(args=${util.format(args)}) \ncommand=${command} \ncwd=${cwd} \nshell=${this.shell}`);
        return new Promise<any>((resolve) => {
            this.ceedlingProcess = child_process.exec(
                command, { cwd: cwd, shell: this.shell },
                (error, stdout, stderr) => {
                    const ansiEscapeSequencesRemoved = this.getConfiguration().get<boolean>('ansiEscapeSequencesRemoved', true);
                    if (ansiEscapeSequencesRemoved) {
                        // Remove ansi colors from the outputs
                        stdout = stripAnsi(stdout);
                        stderr = stripAnsi(stderr);
                    }
                    this.logger.debug(`exec done`);
                    resolve({ error, stdout, stderr });
                },
            )
        })
    }

    public cancel()
    {
        if (this.ceedlingProcess !== undefined) {
            if (this.ceedlingProcess.pid) {
                tree_kill(this.ceedlingProcess.pid);
            }
        }
    }
}