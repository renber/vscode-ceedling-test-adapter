import {
    TestInfo,
    TestSuiteInfo
} from 'vscode-test-adapter-api';

export type ProjectData = {
    projectPath: string,
    ymlFileName: any,
    absPath: string,
    debugLaunchConfig: string,
    files: {
        assembly?: string[],
        header?: string[],
        source?: string[],
        test?: string[],
    }
}

export type ProjectConfig = {
    path: string,
    debugLaunchConfig: string,
    name?: string,
}

export interface ExtendedTestSuiteInfo extends TestSuiteInfo {
    projectKey: string | undefined,
    isProjectRoot: boolean
}

export interface ExtendedTestInfo extends TestInfo {
    projectKey: string
}