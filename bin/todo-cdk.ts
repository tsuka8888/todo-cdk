#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { TodoCdkStack } from '../lib/todo-cdk-stack';

const app = new App();
new TodoCdkStack(app, 'TodoCdkStack');
