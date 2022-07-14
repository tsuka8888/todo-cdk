#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { PreProcess } from '../lib/preprocess';
import { TodoCdkStack } from '../lib/todo-cdk-stack';

PreProcess.generateBundlePackage()

const app = new App();
new TodoCdkStack(app, 'TodoCdkStack');
