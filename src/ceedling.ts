import { Logger } from './logger';
import stripAnsi from 'strip-ansi';
import util from 'util';
import child_process from 'child_process';
import tree_kill from 'tree-kill';
import { ProjectData } from './models';
import { ExtensionConfiguration } from './services/interfaces';

export class Ceedling
{
    private ceedlingProcess: child_process.ChildProcess | undefined;

    constructor(    
        private readonly config : ExtensionConfiguration,
        private readonly logger: Logger,
    ) {
        // --
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
        
        this.logger.debug(`execCeedling(args=${util.format(args)}) \ncommand=${command} \ncwd=${cwd} \nshell=${this.config.getShellPath()}`);
        return new Promise<any>((resolve) => {
            this.ceedlingProcess = child_process.exec(
                command, { cwd: cwd, shell: this.config.getShellPath() },
                (error, stdout, stderr) => {
                    const ansiEscapeSequencesRemoved = this.config.getAnsiEscapeSequencesRemoved()
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