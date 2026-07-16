import { ProjectConfig } from "../models";
import { ProblemMatchingPattern } from "../problemMatcher";


/**
 * Interface for providing settings / preferences to the different
 * components of this extension
 */
export interface ExtensionConfiguration
{
    /**
     * The shell to use for executing ceedling commands
     */
    getShellPath(): string | undefined

    /**
     * Indicates if ANSI escape sequences should be removed from ceedlings output
     */
    getAnsiEscapeSequencesRemoved(): boolean

    isProblemMatchingEnabled(): Boolean;

    getProjectConfigurations(): Array<ProjectConfig>;

    getTestCommandArguments(): Array<string>;

    getTestCaseMacroAliases(): Array<string>;

    getTestRangeMacroAliases(): Array<string>;

    usePrettyTestFileLabel(): Boolean;

    usePrettyTestCaseLabel(): Boolean;

    getProblemMatchingMode(): string;

    getProblemMatchingPatterns(): Array<ProblemMatchingPattern>;
}